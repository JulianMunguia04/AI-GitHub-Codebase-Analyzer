print("TREE BUILDER LOADED")

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