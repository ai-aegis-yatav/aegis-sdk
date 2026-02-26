package streaming

import (
	"bufio"
	"io"
	"strings"
)

// SSEEvent represents a Server-Sent Event.
type SSEEvent struct {
	Event string
	Data  string
	ID    string
	Retry string
}

// StreamReader reads SSE events from an HTTP response body.
type StreamReader struct {
	scanner *bufio.Scanner
	body    io.ReadCloser
	event   SSEEvent
	err     error
}

func NewStreamReader(body io.ReadCloser) *StreamReader {
	return &StreamReader{
		scanner: bufio.NewScanner(body),
		body:    body,
	}
}

// Next advances to the next SSE event. Returns false when the stream is
// exhausted or an error occurs (retrieve via Err()).
func (r *StreamReader) Next() bool {
	var currentEvent SSEEvent
	hasData := false

	for r.scanner.Scan() {
		line := r.scanner.Text()

		if line == "" {
			if hasData {
				r.event = currentEvent
				return true
			}
			continue
		}

		if strings.HasPrefix(line, ":") {
			continue
		}

		field, value, _ := strings.Cut(line, ":")
		value = strings.TrimPrefix(value, " ")

		switch field {
		case "event":
			currentEvent.Event = value
			hasData = true
		case "data":
			if currentEvent.Data != "" {
				currentEvent.Data += "\n"
			}
			currentEvent.Data += value
			hasData = true
		case "id":
			currentEvent.ID = value
		case "retry":
			currentEvent.Retry = value
		}
	}

	r.err = r.scanner.Err()

	if hasData {
		r.event = currentEvent
		return true
	}
	return false
}

// Event returns the current SSE event.
func (r *StreamReader) Event() SSEEvent {
	return r.event
}

// Err returns any error from scanning.
func (r *StreamReader) Err() error {
	return r.err
}

// Close closes the underlying response body.
func (r *StreamReader) Close() error {
	return r.body.Close()
}
