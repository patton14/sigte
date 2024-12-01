export const filterMenuItemsByRoles = (items, authorizations) => {
    const userRoles = authorizations.map(auth => auth.RolID);

    const hasRole = (itemRoles) => itemRoles.some(role => userRoles.includes(role));

    return items.map(menuSection => {
        return {
            ...menuSection,
            items: menuSection.items.filter(item => hasRole(item.roles))
        };
    }).filter(menuSection => menuSection.items.length > 0);
};
