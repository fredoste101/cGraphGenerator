var nodeX = 0;
var nodeY = 0;
var nodeMap = [];
var currentEdgeId = 0;
var currentNodeMoved = null;

window.addEventListener("load", init);


let nodeListString = `  [
                            {"id":0, "content":"main()", "nodeIndexList":[1]}, 
                            {"id":1, "content":"int a = 2;", "nodeIndexList":[2,3]},
                            {"id":2, "content":"if(a == 3)", "nodeIndexList":[4]},
                            {"id":3, "content":"printf(\\"Hello world!\\");<br\\/>int b = 4", "nodeIndexList":[5]},
                            {"id":4, "content":"printf(\\"A == 3\\")", "nodeIndexList":[3]},
                            {"id":5, "content":"for(a; a < b; a++)", "nodeIndexList":[6]},
                            {"id":6, "content":"printf(\\"%d\\", a)", "nodeIndexList":[7]},
                            {"id":7, "content":"return a;", "nodeIndexList":[]}
                        ]`;

                        /*
                            main()
                            {
                                int a = 2;

                                if(a == 3)
                                {
                                    printf(A == 3)
                                }

                                printf("Hello World");
                                int b = 4;

                                for(a; a < b; a++)
                                {
                                    printf("%d", a);
                                }

                                return a;

                            }


                        */

var jsonNodeList = JSON.parse(nodeListString);

class Node
{
    constructor(id, content, nodeList) 
    {
        this.id = id;
        this.content = content;
        this.nodeList = nodeList;	//Next nodes / children / whatever
        
        this.htmlElement = null;
        this.classList = [];
        
        this.edgeStartList = [];	//Edges that this node is connect with.
        this.edgeEndList = [];
    }


    setNodeList(nodeList)
    {
        this.nodeList = nodeList;
    }
    

    setHtmlElement(element)
    {
        this.htmlElement = element;
    }
    
    
    getHtmlElement()
    {
        return this.htmlElement;
    }
    
    
    getId()
    {
        return this.id;
    }
    
    
    getContent()
    {
        return this.content;
    }
    
    
    //Get the child-list or whatever
    getNodeList()
    {
        return this.nodeList;
    }
    
    
    getStartEdgeList()
    {
        return this.edgeStartList;
    }
    
    
    appendStartEdge(edge)
    {
        this.edgeStartList.push(edge);
    }
    
    
    getEndEdgeList()
    {
        return this.edgeEndList;
    }
    
    
    appendEndEdge(edge)
    {
        this.edgeEndList.push(edge);
    }
    
}

class Edge
{
    constructor()
    {
        this.id         = id;
        this.svgElement = null;
    }
}


function init()
{
    
    let jsonNodeMap = [];

    for(let i = 0; i < jsonNodeList.length; i++)
    {
        jsonNodeMap.push(new Node(jsonNodeList[i].id, jsonNodeList[i].content, []));
    }

    for(let i = 0; i < jsonNodeList.length; i++)
    {
        let childNodeList = [];

        for(let j = 0; j < jsonNodeList[i].nodeIndexList.length; j++)
        {
            childNodeList.push(jsonNodeMap[ jsonNodeList[i].nodeIndexList[j] ]);
        }

        jsonNodeMap[i].setNodeList(childNodeList);
    }

    nodeMap = jsonNodeMap;

    let currentInsertY = 0;
    let currentInsertX = 0;
    
    for(i = 0; i < nodeMap.length; i++)
    {
        let node = nodeMap[i];
        
        if(node.getHtmlElement() == null)
        {
            let nodeElement 		= document.createElement("div");
            
            nodeElement.id 			= node.getId();
            nodeElement.textContent = node.getContent();
            nodeElement.classList.add("node");
            
            document.getElementById("area").append(nodeElement);
            
            nodeMap[i].setHtmlElement(nodeElement);
            
            currentInsertY = nodeElement.offsetHeight + 10;
            
            appendNodeChildren(node, currentInsertX, currentInsertY);
        
        }
        else
        {
            appendNodeChildren(node, currentInsertX, currentInsertY);
        }
    }
    
    //Set event listeners
    
    nodes = document.getElementsByClassName("node");
    
    for(i = 0; i < nodes.length; i++)
    {
        nodes[i].addEventListener("mousedown", 	setMovable);
        nodes[i].addEventListener("mouseup", 	unsetMovable);
        nodes[i].addEventListener("mouseout", 	moveNodeQuick);
        nodes[i].addEventListener("mouseout",   unsetMovable);
    }
    
}


function appendNodeChildren(parent, currentInsertX, currentInsertY)
{
    nodeList = parent.getNodeList();
    
    parentElement = parent.getHtmlElement();
    
    for(j = 0; j < nodeList.length; j++)
    {
        let child = nodeList[j];
        let nodeElement = child.getHtmlElement();
        
        if(nodeElement == null)
        {
            nodeElement = document.createElement("div");
            nodeElement.classList.add("node");
            nodeElement.id 			= child.getId();
            nodeElement.textContent = child.getContent();
            
            nodeElement.style.top 	= currentInsertY + "px";
            nodeElement.style.left 	= currentInsertX + "px";
            
            
            document.getElementById("area").append(nodeElement);
            
            child.setHtmlElement(nodeElement);
            
            currentInsertX += nodeElement.offsetWidth + currentInsertX + 10;
        }
        
        let connectingEdge = appendEdge(currentEdgeId, 
                                        getElementMiddlePoint(parentElement), 
                                        getElementMiddlePoint(nodeElement));
                                            
        parent.appendStartEdge(connectingEdge);
        child.appendEndEdge(connectingEdge);
        currentEdgeId++;
    }
}


//pos == [x ,y]
function appendEdge(id, pos1, pos2)
{
    var svgNS = "http://www.w3.org/2000/svg";  

    var myLine = document.createElementNS(svgNS,"line");
    
    myLine.setAttributeNS(null, "id", id);
    myLine.setAttributeNS(null, "x1", pos1[0]);
    myLine.setAttributeNS(null, "y1", pos1[1]);
    myLine.setAttributeNS(null, "x2", pos2[0]);
    myLine.setAttributeNS(null, "y2", pos2[1]);
    myLine.setAttributeNS(null, "stroke", "black");
    
    let svgElement = document.getElementById("mySVG");
    
    //console.dir(svgElement);
    
    svgElement.appendChild(myLine);
    
    return myLine;
}


function getElementMiddlePoint(element)
{
    let x = element.offsetLeft + element.offsetWidth/2;
    let y = element.offsetTop  + element.offsetHeight/2;
    
    return [x, y];
}



function setMovable(event)
{
    nodeX = event.pageX;
    nodeY = event.pageY;
    event.target.addEventListener("mousemove", moveNode);
    currentNodeMoved = event.target;
}

function unsetMovable(event)
{
    //console.log("UNSET!");
    event.target.removeEventListener("mousemove", moveNode);
    event.target.removeEventListener("mouseout",  moveNodeQuick);
    currentNodeMoved = null;
}


function moveNodeQuick(event)
{  
    event.pageX;
    event.pateY;
   //I think the idea was to move quick when mouse left node 
}


function moveNode(event)
{
    let deltaX = nodeX - event.pageX;
    let deltaY = nodeY - event.pageY;
    
    let nodeHeight = event.target.offsetHeight;
    let nodeWidth   = event.target.offsetWidth;
    
    nodeX = event.pageX;
    nodeY = event.pageY;

    event.target.style.top 	= nodeY - nodeHeight/2 + deltaY + "px";
    event.target.style.left = nodeX - nodeWidth/2  + deltaX + "px";
    
    node = nodeMap[event.target.id];
    
    endEdgeList 	= node.getEndEdgeList();
    startEdgeList 	= node.getStartEdgeList();
    
    pos = getElementMiddlePoint(event.target);
    
    for(i = 0; i < endEdgeList.length; i++)
    {
        changeEdgeEndPoint(endEdgeList[i], pos);
    }
    
    for(i = 0; i < startEdgeList.length; i++)
    {
        changeEdgeStartPoint(startEdgeList[i], pos);
    }
}


function moveElement(element, pos)
{
    deltaX = nodeX - event.pageX;
    deltaY = nodeY - event.pageY;
    
    let nodeHeight = element.offsetHeight;
    let nodeWidth   = element.offsetWidth;

    element.style.top 	= nodeY - nodeHeight/2 + deltaY + "px";
    element.style.left  = nodeX - nodeWidth/2  + deltaX + "px";
}


function changeEdgeEndPoint(edge, pos)
{
    edge.setAttributeNS(null, "x2", pos[0]);
    edge.setAttributeNS(null, "y2", pos[1]);
}

function changeEdgeStartPoint(edge, pos)
{
    edge.setAttributeNS(null, "x1", pos[0]);
    edge.setAttributeNS(null, "y1", pos[1]);
}