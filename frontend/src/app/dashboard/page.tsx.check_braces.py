import re

def parse_tags(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Remove JSX/JS comments
    # Multi-line comment /* ... */
    content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
    # JSX comment {/* ... */}
    content = re.sub(r'\{\s*/\*.*?\*/\s*\}', '', content, flags=re.DOTALL)
    # Single-line comment // ...
    content = re.sub(r'//.*', '', content)
    
    # We will search for tags globally
    # Find tags matching <TagName ... > or </TagName> or <TagName />
    # Let's write a regex that matches JSX tags.
    # Note: we need to handle quotes inside tags.
    # A JSX tag: <, followed by optional /, followed by tag name, followed by attributes, followed by optional /, followed by >
    # Tag names can be standard HTML or custom Component names.
    tag_regex = re.compile(r'<(/?[a-zA-Z0-9_\.-]+)(?:\s+[^>]*?)?(/?)>')
    
    # Let's scan using a custom parser to be robust against strings and JS code
    # We will just use regex finditer for simplicity, but we must make sure we don't match < or > inside strings.
    # To do that, let's first strip out all strings.
    # Let's replace double-quoted, single-quoted, and template literal strings with empty string placeholders.
    content_no_str = re.sub(r'"(?:\\.|[^"\\])*"', '""', content)
    content_no_str = re.sub(r"'(?:\\.|[^'\\])*'", "''", content_no_str)
    content_no_str = re.sub(r"`(?:\\.|[^`\\])*`", "``", content_no_str)
    
    # Now find tags in content_no_str
    matches = []
    # To get line numbers, let's find tag offsets in the original content
    for m in tag_regex.finditer(content_no_str):
        tag_text = m.group(0)
        tag_name = m.group(1)
        is_closing = tag_name.startswith('/')
        is_self_closing = m.group(2) == '/' or tag_name.lower() in ['input', 'img', 'br', 'hr', 'meta', 'link']
        
        # Calculate line number
        offset = m.start()
        line_num = content_no_str[:offset].count('\n') + 1
        
        matches.append({
            'name': tag_name[1:] if is_closing else tag_name,
            'is_closing': is_closing,
            'is_self_closing': is_self_closing,
            'line': line_num,
            'full': tag_text
        })
        
    stack = []
    for m in matches:
        if m['is_self_closing']:
            continue
        if m['is_closing']:
            if not stack:
                print(f"Error: Closing tag </{m['name']}> at line {m['line']} has no matching opening tag.")
                return
            top = stack.pop()
            if m['name'] != top['name']:
                print(f"Error: Mismatched tag </{m['name']}> at line {m['line']} does not match <{top['name']}> from line {top['line']}")
                return
        else:
            stack.append(m)
            
    if stack:
        print("Unclosed tags left on stack:")
        for top in stack:
            print(f"  <{top['name']}> at line {top['line']} ({top['full']})")
    else:
        print("Success: All tags match!")

if __name__ == '__main__':
    parse_tags(r"C:\Users\Admin\Desktop\Project Management\frontend\src\app\dashboard\page.tsx")
