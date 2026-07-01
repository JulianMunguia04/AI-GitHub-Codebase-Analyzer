def extract_chunks(tree, path=""):
    chunks = []

    for name, node in tree.items():
        current_path = f"{path}/{name}" if path else name

        # file node
        if isinstance(node, dict) and node.get("type") == "blob":
            if "content" in node:
                chunks.append({
                    "path": current_path,
                    "content": node["content"],
                    "size": node.get("size", 0)
                })

        # folder node
        elif isinstance(node, dict):
            nested_chunks = extract_chunks(node, current_path)
            chunks.extend(nested_chunks)

    return chunks