export const getQueryParams = function() {
    const query = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(query.entries());
    return params;
}