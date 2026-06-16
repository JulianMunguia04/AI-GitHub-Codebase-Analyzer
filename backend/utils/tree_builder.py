def build_tree(flat_tree):
    root = {}

    for item in flat_tree:
        path = item["path"].split("/")
        current = root

        for part in path[:-1]:
            if part not in current:
                current[part] = {}
            current = current[part]

        filename = path[-1]

        current[filename] = {
            "type": item.get("type"),
            "sha": item.get("sha"),
            "size": item.get("size"),
        }

    return root

def flatten_tree(tree, path=""):
    files = []

    for name, node in tree.items():
        current_path = f"{path}/{name}" if path else name

        if isinstance(node, dict) and node.get("type") == "blob":
            files.append(current_path)

        elif isinstance(node, dict):
            files.extend(flatten_tree(node, current_path))

    return files