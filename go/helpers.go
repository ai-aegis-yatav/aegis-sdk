package aegis

import (
	"net/url"
	"strings"
)

func buildPath(base string, params map[string]string) string {
	if len(params) == 0 {
		return base
	}
	q := url.Values{}
	for k, v := range params {
		q.Set(k, v)
	}
	encoded := q.Encode()
	if encoded == "" {
		return base
	}
	var sb strings.Builder
	sb.WriteString(base)
	sb.WriteByte('?')
	sb.WriteString(encoded)
	return sb.String()
}
