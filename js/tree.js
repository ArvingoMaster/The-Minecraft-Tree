var layoutInfo = {
    startTab: "d",
	showTree: true,
    treeLayout: "",


}


// A "ghost" layer which offsets other layers in the tree
addNode("W", {
    showTree: true,

},
)


addLayer("tree-tab", {
    tabFormat: [["tree", function() {return (layoutInfo.treeLayout ? layoutInfo.treeLayout : TREE_LAYERS)}]]
})
