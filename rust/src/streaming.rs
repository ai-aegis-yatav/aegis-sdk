use futures_core::Stream;
use reqwest::Response;
use serde::{Deserialize, Serialize};

use crate::error::{AegisError, Result};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SseEvent {
    #[serde(default)]
    pub event: Option<String>,
    pub data: String,
    #[serde(default)]
    pub id: Option<String>,
}

pub struct SseStream {
    response: Response,
    buffer: String,
}

impl SseStream {
    pub fn new(response: Response) -> Self {
        Self {
            response,
            buffer: String::new(),
        }
    }

    pub fn into_stream(self) -> impl Stream<Item = Result<SseEvent>> {
        async_stream::try_stream! {
            let mut stream = self;
            loop {
                let chunk = match stream.response.chunk().await {
                    Ok(Some(c)) => c,
                    Ok(None) => break,
                    Err(e) => {
                        Err(AegisError::Network(e))?;
                        break;
                    }
                };

                let text = String::from_utf8_lossy(&chunk);
                stream.buffer.push_str(&text);

                while let Some(event) = parse_sse_event(&mut stream.buffer) {
                    yield event;
                }
            }

            // Flush any remaining buffered event
            if !stream.buffer.trim().is_empty() {
                if let Some(event) = parse_sse_event(&mut stream.buffer) {
                    yield event;
                }
            }
        }
    }
}

fn parse_sse_event(buffer: &mut String) -> Option<SseEvent> {
    let separator = if buffer.contains("\n\n") {
        "\n\n"
    } else if buffer.contains("\r\n\r\n") {
        "\r\n\r\n"
    } else {
        return None;
    };

    let pos = buffer.find(separator)?;
    let raw_event: String = buffer.drain(..pos + separator.len()).collect();

    let mut event_type = None;
    let mut data_lines = Vec::new();
    let mut id = None;

    for line in raw_event.lines() {
        if line.starts_with("event:") {
            event_type = Some(line.trim_start_matches("event:").trim().to_string());
        } else if line.starts_with("data:") {
            data_lines.push(line.trim_start_matches("data:").trim().to_string());
        } else if line.starts_with("id:") {
            id = Some(line.trim_start_matches("id:").trim().to_string());
        }
    }

    if data_lines.is_empty() && event_type.is_none() {
        return None;
    }

    Some(SseEvent {
        event: event_type,
        data: data_lines.join("\n"),
        id,
    })
}
