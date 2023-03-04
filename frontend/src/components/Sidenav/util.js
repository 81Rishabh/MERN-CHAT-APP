export  const removeNavItemsActiveStyle = function(itemsRef){
    const Items = itemsRef.current.children;
    Array.from(Items).forEach(item => item.classList.remove('active'));
}
