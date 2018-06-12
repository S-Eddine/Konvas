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
            <div>
                <form  style={{ display: 'inline-block' }} onSubmit={event => { event.preventDefault(); }} >
                    <input
                        id="find-box"
                        type="text"
                        placeholder="Search..."
                        style={{ fontSize: '1rem' }}
                        value={searchString}
                        onChange={this.props.onChangeInputSearch } />

                    <button type="button" disabled={!searchFoundCount} onClick={this.props.selectPrevMatch} >
                        &lt;
                    </button>

                    <button type="submit" disabled={!searchFoundCount} onClick={this.props.selectNextMatch}  >
                        &gt;
                    </button>

                    <span>
                        &nbsp;
                        {searchFoundCount > 0 ? searchFocusIndex + 1 : 0}
                        &nbsp;/&nbsp;
                        {searchFoundCount || 0}
                    </span>
                </form>
            </div>
        );
    }
}

render(<Search />, document.getElementById('root'));