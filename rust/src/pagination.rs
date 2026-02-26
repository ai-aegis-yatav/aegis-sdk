use futures_core::Stream;
use serde::de::DeserializeOwned;
use std::future::Future;
use std::pin::Pin;

use crate::error::Result;

pub struct Paginator<T> {
    fetch_fn: Box<
        dyn Fn(i32, i32) -> Pin<Box<dyn Future<Output = Result<PageResult<T>>> + Send>>
            + Send
            + Sync,
    >,
    page: i32,
    limit: i32,
    exhausted: bool,
}

pub struct PageResult<T> {
    pub items: Vec<T>,
    pub has_more: bool,
}

impl<T: DeserializeOwned + Send + 'static> Paginator<T> {
    pub fn new<F, Fut>(limit: i32, fetch_fn: F) -> Self
    where
        F: Fn(i32, i32) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = Result<PageResult<T>>> + Send + 'static,
    {
        Self {
            fetch_fn: Box::new(move |page, lim| Box::pin(fetch_fn(page, lim))),
            page: 1,
            limit,
            exhausted: false,
        }
    }

    pub fn into_stream(self) -> impl Stream<Item = Result<T>> {
        async_stream::try_stream! {
            let mut paginator = self;
            loop {
                if paginator.exhausted {
                    break;
                }
                let result = (paginator.fetch_fn)(paginator.page, paginator.limit).await?;
                if result.items.is_empty() || !result.has_more {
                    for item in result.items {
                        yield item;
                    }
                    break;
                }
                paginator.page += 1;
                for item in result.items {
                    yield item;
                }
            }
        }
    }
}
