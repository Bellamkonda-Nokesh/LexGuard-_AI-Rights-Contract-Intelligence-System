"""Input sanitization and security utilities for LexGuard.
Prevents script injection, invalid byte encodings, and malformed contract texts.
"""
import re
import html
import unicodedata

class TextSanitizer:
    """Sanitizes text extracted from uploaded documents and user inputs."""

    @staticmethod
    def sanitize_text(text: str, max_chars: int = 250_000) -> str:
        """Strip HTML tags, script tokens, null bytes, and normalize unicode."""
        if not text:
            return ""

        # Normalize unicode to NFKC
        cleaned = unicodedata.normalize("NFKC", text)

        # Remove null bytes and binary control characters (preserve newlines and tabs)
        cleaned = re.sub(r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]", "", cleaned)

        # Strip html/script tags
        cleaned = re.sub(r"<[^>]+>", " ", cleaned)

        # Escape special HTML entities so rendering in frontend is secure
        # But allow normal punctuation
        cleaned = html.escape(cleaned, quote=False)

        # Unescape basic punctuation that was escaped needlessly
        cleaned = cleaned.replace("&amp;", "&").replace("&#x27;", "'")

        # Collapse excess whitespace while retaining paragraph structure
        cleaned = re.sub(r"[ \t]+", " ", cleaned)
        cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)

        # Truncate to maximum characters to protect downstream agents
        if len(cleaned) > max_chars:
            cleaned = cleaned[:max_chars]

        return cleaned.strip()

    @staticmethod
    def sanitize_filename(filename: str) -> str:
        """Sanitize uploaded filename to prevent directory traversal."""
        if not filename:
            return "unnamed_document.pdf"
        # Extract basename
        basename = filename.split("/")[-1].split("\\")[-1]
        # Keep alphanumeric, dot, dash, underscore, space
        sanitized = re.sub(r"[^a-zA-Z0-9.\-_ ]", "_", basename)
        return sanitized[:128]

sanitizer = TextSanitizer()
