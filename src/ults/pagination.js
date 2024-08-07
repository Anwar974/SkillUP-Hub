export const pagination = (page, limit) => {
    if (!page || page <= 0) {
        page = 1;
    }

    if (!limit || limit <= 0) {
        limit = 3;
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);

    return { skip, limit };
};

export const ApplicationsPagination = (page, limit) => {
    if (!page || page <= 0) {
        page = 1;
    }

    if (!limit || limit <= 0) {
        limit = 10;
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);

    return { skip, limit };
};