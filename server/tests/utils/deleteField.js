function deleteField(obj, fieldPath) {
    const parts = fieldPath.split('.');

    if (parts.length === 1) {
        delete obj[fieldPath];
        return;
    }

    let current = obj;
    for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) return;
        current = current[parts[i]];
    }

    delete current[parts[parts.length - 1]];
}

module.exports = { deleteField }