import { render } from 'react-dom';
import React, { Component } from 'react';
import data from './data.json'
import SortableTree, { addNodeUnderParent, removeNodeAtPath } from 'react-sortable-tree';
import './index.css'
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';




export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [data],
      activatedNode: null,
      activatedNodePathLength: null
    };
  }

  canDrop = (event) => {
    return event.prevPath.length === event.nextPath.length;
  }

  handleAddClick = (node, path) => () => {
    this.setState(state => ({
      treeData: addNodeUnderParent({
        treeData: state.treeData,
        parentKey: path[path.length - 1],
        expandParent: true,
        getNodeKey: ({ treeIndex }) => treeIndex,
        newNode: {
          title: 'XX - Default',
        },
      }).treeData,
    }))
  }

  handleRemoveClick = (node, path) => () => {
    this.setState(state => ({
      treeData: removeNodeAtPath({
        treeData: state.treeData,
        path,
        getNodeKey: ({ treeIndex }) => treeIndex,
      }),
    }))
  }

  onMouseOver = (nodeId, activatedNodePathLength) => (event) => {
    this.setState({activatedNode: nodeId, activatedNodePathLength: activatedNodePathLength});
  }

  onMouseOut = () => (event) => {
    this.setState({activatedNode: null, activatedNodePathLength: null});
  }

  onClick = () => (event) => {
    console.log("salah")
  }

  generateNodeProps_ = (event) => {
    const addButton = <div className="tree-button" onClick={this.handleAddClick(event.node, event.path)} >
                        <i className="fas fa-plus"></i>
                      </div>;
    const removeButton =  <div className="tree-button" onClick={this.handleRemoveClick(event.node, event.path)} >
                            <i className="fas fa-trash"></i>
                          </div>;
    const buttons = [addButton];

    if(event.parentNode) {
      buttons.push(removeButton);
    }

    return {
      className: `hide ${(event.node.id === this.state.activatedNode  &&
                    event.path.length === this.state.activatedNodePathLength) ? "active" : ""}`,
      onMouseOver: this.onMouseOver(event.node.id, event.path.length),
      onMouseOut: this.onMouseOut(event.node.id, event.path.length),
      onClick: this.onClick(event.node.id),
      buttons: buttons,
    }
    
  };

  render() {
    return (
      <div>
        <div style={{height: 900, width:400,  overflow: 'auto' }}>
          <SortableTree
            treeData={this.state.treeData}
            onChange={treeData => this.setState({ treeData })}
            canDrop={this.canDrop}
            generateNodeProps={this.generateNodeProps_}
            theme={FileExplorerTheme}
          />
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));