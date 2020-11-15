import React from "react";
import ReactDOM from "react-dom"

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            serverURL: "http://localhost:8080/",
            viewData: ""
        };
    }

    /**
     * 
     * @param {String} path 
     */
    onMainViewClick = (path) => {
        if (path.startsWith("http")) { // is not a relative link
            window.open(path, '_blank');
        } else {
            const fileExtension = path.split('.').pop();
            if (!fileExtension || fileExtension.length === 0) {
                console.log(`not a valid file path right now. path: ${path}`);
            }
            if (fileExtension === 'md') {
                this.loadPage(path);
            } else if (fileExtension === 'pdf') {
                this.loadLocalPdf(path);
            }
        }
    }

    /**
     * open pdf in new tab
     * @param {String} pathName 
     */
    loadLocalPdf = (pathName) => {
        console.log(`load pdf: ${pathName} `);
        const pagePath = this.state.serverURL + pathName;
        window.open(pagePath, '_blank');
    }

    /**
     * 
     * @param {String} pageName the page to load
     */
    loadPage = (pageName) => {
        const pagePath = this.state.serverURL + pageName;
        // TODO: sanitize viewData here
        // i.e. resolve all relative links
        fetch(pagePath)
            .then(resp => resp.text())
            .then(data => {
                this.setState({ viewData: data });
            });
    }

    render() {
        return (
            <React.Fragment>
                <Sidebar onPageClick={this.loadPage} serverURL={this.state.serverURL}></Sidebar>
                <MainView pageData={this.state.viewData} onPageClick={this.onMainViewClick}> </MainView>
            </React.Fragment>

        )
    }
}

function MainView(props) {

    /**
     * 
     * @param {Event} e 
     */
    function onViewClick(e) {
        // if click an anchor tag
        if (e.target.localName == 'a') {
            e.preventDefault();
            const targetLink = String(e.target.getAttribute('href'));
            props.onPageClick(targetLink);
        }
    }

    // TODO: handle assets loading for other tags apart from img as well
    let mainDiv = document.createElement('div');
    mainDiv.innerHTML = props.pageData;
    mainDiv.querySelectorAll('img').forEach((img) => {
        img.setAttribute('src', `http://localhost:8080/${img.getAttribute('src')}`);
    });
    mainDiv.querySelectorAll('link').forEach((link) => {
        link.removeAttribute('href');
    });
    const innerHTML = {
        __html: mainDiv.innerHTML
    };
    return (<div onClick={onViewClick} dangerouslySetInnerHTML={innerHTML} />);
}

class Sidebar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pageList: []
        }
        this.handleItemClick = this.handleItemClick.bind(this);
    }

    componentDidMount() {
        let listAllPath = this.props.serverURL + "list-all";
        fetch(listAllPath)
            .then(resp => {
                if (!resp.ok) {
                    console.log('server unavailable');
                    return;
                }
                return resp.text();
            })
            .then(data => {
                let pageList = this.getPageList(data);
                this.setState({ pageList });
            });
    }

    getPageList(htmlListString) {
        let received = document.createElement('div');
        received.innerHTML = htmlListString;
        const allPagesList = received.querySelectorAll('a');
        let pageList = [];
        allPagesList.forEach(page => {
            const pageName = page.href.split('/').pop();
            page.href = "";
            pageList.push(pageName);
        });
        return pageList;
    }

    /**
     * receives a click event, calls the props.OnPageClick function
     * with the pageName as parameters
     * @param {Event} e the click event on page listing
     */
    handleItemClick = (e) => {
        try {
            const pageName = e.target.innerText.trim();
            this.props.onPageClick(pageName);
        } catch (error) {
            console.log('Not a valid link click.');
        }
    }

    render() {

        let pageListElement = document.createElement('ul');
        pageListElement.style.listStyleType = 'none';
        let pageLi = this.state.pageList.map(page =>
            <li key={page}><a href="#" onClick={this.handleItemClick}>{page}</a></li>
        );
        return <ul> {pageLi} </ul>;
    }
}


let appNode = document.getElementById('app');
ReactDOM.render(<App />, appNode);
