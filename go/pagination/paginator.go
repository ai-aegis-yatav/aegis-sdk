package pagination

import (
	"context"
	"fmt"
)

// FetchFunc retrieves a page of results. page is 1-indexed.
type FetchFunc[T any] func(ctx context.Context, page, perPage int) (items []T, total int, err error)

// Paginator provides lazy iteration over paginated API results.
type Paginator[T any] struct {
	ctx     context.Context
	fetch   FetchFunc[T]
	perPage int

	page    int
	items   []T
	idx     int
	total   int
	done    bool
	err     error
}

func NewPaginator[T any](ctx context.Context, perPage int, fetch FetchFunc[T]) *Paginator[T] {
	if perPage <= 0 {
		perPage = 20
	}
	return &Paginator[T]{
		ctx:     ctx,
		fetch:   fetch,
		perPage: perPage,
		page:    0,
	}
}

// Next advances to the next item. Returns false when exhausted or on error.
func (p *Paginator[T]) Next() bool {
	if p.done {
		return false
	}
	if p.idx < len(p.items) {
		return true
	}

	p.page++
	items, total, err := p.fetch(p.ctx, p.page, p.perPage)
	if err != nil {
		p.err = err
		p.done = true
		return false
	}

	p.total = total
	p.items = items
	p.idx = 0

	if len(items) == 0 {
		p.done = true
		return false
	}
	return true
}

// Item returns the current item. Must be called after a successful Next().
func (p *Paginator[T]) Item() T {
	if p.idx >= len(p.items) {
		var zero T
		return zero
	}
	item := p.items[p.idx]
	p.idx++
	return item
}

// Err returns any error from fetching pages.
func (p *Paginator[T]) Err() error {
	return p.err
}

// All consumes the paginator and returns all items.
func (p *Paginator[T]) All() ([]T, error) {
	var all []T
	for p.Next() {
		all = append(all, p.Item())
	}
	if p.err != nil {
		return nil, fmt.Errorf("pagination error: %w", p.err)
	}
	return all, nil
}
