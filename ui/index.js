import React from "react";
import ReactDOM from "react-dom"

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            serverURL: "http://localhost:8080/",
            viewData: ""
        };
        this.registerAllClicks();
    }

    registerAllClicks = () => {
        window.onclick = function (e) {
            if(e.target.localName == "a") {
                console.log('a tag clicked!');
                // e.stopPropagation();
                e.preventDefaul();
            }
        }
    }

    handlePageClick = (e) => {
        console.log("called with params: ", e.target.innerText);
        const pageName = e.target.innerText.trim();
        const pagePath = this.state.serverURL + pageName;
        fetch(pagePath)
            .then(resp => resp.text())
            .then(data => {
                this.setState({viewData: data});
                // document.getElementById('main').innerHTML = data;
            });

    }

    render() {
        return (
            <React.Fragment>
                <Sidebar onPageClick={this.handlePageClick}></Sidebar>
                <MainView pageData={this.state.viewData}> </MainView>
            </React.Fragment>

        )
    }
}

function MainView(props) {
    const innerHTML = {
        __html: props.pageData
    };
    return (<div dangerouslySetInnerHTML={innerHTML}/>);
}

class Sidebar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pageList: []
        }
    }

    componentDidMount() {
        console.log("init bar called");
        let serverURL = "http://localhost:8080/";
        let listAllPath = serverURL + "list-all";
        fetch(listAllPath)
            .then(resp => {
                if (!resp.ok) {
                    let p = document.createElement('p');
                    p.innerText('Opps, Server not found!');
                    this.display.appendChild(p);
                    console.log('server unavailable');
                    return;
                }
                console.log("response ok");
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

    render() {

        let pageListElement = document.createElement('ul');
        pageListElement.style.listStyleType = 'none';
        let pageList = [];
        // console.log("page list: ",  this.state.pageList);
        let pageLi = this.state.pageList.map(page =>
            <li key={page}><a href="#" onClick={this.props.onPageClick}>{page}</a></li>
        );
        console.log("page li: ", pageLi);

        return <ul> {pageLi} </ul>;
    }
}

// let sidebarNode = document.getElementById('sidebar');
// ReactDOM.render(<Sidebar/>, sidebarNode);


let appNode = document.getElementById('app');
ReactDOM.render(<App />, appNode);
