import { render } from 'react-dom';
import React, { Component } from 'react';
import data from './data.json'
import SortableTree, { addNodeUnderParent, removeNodeAtPath } from 'react-sortable-tree';
import './index.css'
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';
import SearchBox from './../src/Components/searchBox'




export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [data],
      activatedNode: null,
      activatedNodePathLength: null,
      searchString: '',
      searchFocusIndex: 0,
      searchFoundCount: null
    }
  }

  /* TREE FUNCTIONS -- START -- */

  canDrop = (event) => {
    return event.prevPath.length === event.nextPath.length;
  }

  handleDataChange = (treeData) => {
    this.setState({ treeData });
  };

  handleAddClick = (node, path) => () => {
    this.setState(state => ({
      treeData: addNodeUnderParent({
        treeData: state.treeData,
        parentKey: path[path.length - 1],
        expandParent: true,
        getNodeKey: ({ treeIndex }) => treeIndex,
        newNode: {
          title: 'AA - Default',
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
  };

  handleMouseOver = (activatedNodeId, activatedNodePathLength) => (event) => {
    this.setState({activatedNodeId, activatedNodePathLength});
  };

  handleMouseOut = () => (event) => {
    this.setState({activatedNode: null, activatedNodePathLength: null});
  };

  handleClick = () => (event) => {
  };

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
      className: `hide ${(event.node.id === this.state.activatedNodeId  &&
                    event.path.length === this.state.activatedNodePathLength) ? "active" : ""}`,
      onMouseOver: this.handleMouseOver(event.node.id, event.path.length),
      onMouseOut: this.handleMouseOut(event.node.id, event.path.length),
      onClick: this.handleClick(event.node.id),
      buttons: buttons,
    }
  };

    /* SEARCH FUNCTIONS -- START -- */

  customSearchMethod = ({ node, searchQuery }) => {
    return searchQuery &&
    node.title.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;
  }


  handleChangeInputSearch = (event) =>  {
    return this.setState({ searchString: event.target.value })
  };

  searchFinishCallback = (matches) => {
    const { searchFocusIndex } = this.state;
    return this.setState({
      searchFoundCount: matches.length,
      searchFocusIndex:
        matches.length > 0 ? searchFocusIndex % matches.length : 0,
    })
  };
  selectPrevMatch = () => {
    const { searchFocusIndex, searchFoundCount } = this.state;
    this.setState({
        searchFocusIndex:
        searchFocusIndex !== null
            ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
            : searchFoundCount - 1,
    });   
  }

  selectNextMatch = () => {
      const { searchFocusIndex, searchFoundCount } = this.state;
      this.setState({
          searchFocusIndex:
          searchFocusIndex !== null
              ? (searchFocusIndex + 1) % searchFoundCount
              : 0,
      });
  }

  searchFinishCallBack = (matches) => {
      const { searchFocusIndex } = this.state;
      this.setState({
          searchFoundCount: matches.length,
          searchFocusIndex:
            matches.length > 0 ? searchFocusIndex % matches.length : 0,
        })
  }


  render() {
    const { searchString, searchFocusIndex, searchFoundCount } = this.state;

    return (
      <div>
        <div style={{height: 900, width:400,  overflow: 'auto' }}>

        <SearchBox 
          onChangeInputSearch={this.handleChangeInputSearch} 
          selectPrevMatch={this.selectPrevMatch} 
          selectNextMatch={this.selectNextMatch}
          searchFocusIndex={searchFocusIndex}
          searchFoundCount={searchFoundCount}
          searchString={searchString}
        />

          <SortableTree
            treeData={this.state.treeData}
            onChange={this.handleDataChange}
            canDrop={this.canDrop}
            generateNodeProps={this.generateNodeProps_}
            theme={FileExplorerTheme}
            searchMethod={this.customSearchMethod}
            searchQuery={searchString}
            searchFocusOffset={searchFocusIndex}
            searchFinishCallback={this.searchFinishCallback}
          />
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));