import { render } from 'react-dom';
import React, { PureComponent } from 'react';

export default class Search extends PureComponent {
    constructor(props){
        super(props);
    } 
    
    render() {
        
        const {  searchString, searchFocusIndex, searchFoundCount } = this.props;
        console.log("bla 3")
        return (
                <div  className="search-box" onSubmit={event => { event.preventDefault(); }} >
                    <div className="search-box-input">
                        <input
                            id="find-box"
                            type="text"
                            placeholder="search..."
                            value={searchString}
                            onChange={this.props.onChangeInputSearch } />
                    </div>
                    <div className="search-box-nav-buttons-prev">
                        <i disabled={!searchFoundCount} onClick={this.props.selectPrevMatch} class="fas fa-arrow-circle-left"></i>
                    </div>
                    <div className="search-box-nav-buttons-next">
                        <i disabled={!searchFoundCount} onClick={this.props.selectNextMatch} class="fas fa-arrow-circle-right"></i>
                    </div>
                    <span className="search-box-results-number">
                        &nbsp;
                        {searchFoundCount > 0 ? searchFocusIndex + 1 : 0}
                        &nbsp;/&nbsp;
                        {searchFoundCount || 0}
                    </span>
                </div>
        );
    }
}

render(<Search />, document.getElementById('root'));