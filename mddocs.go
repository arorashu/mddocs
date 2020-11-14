package main

import (
	"fmt"
	"github.com/gomarkdown/markdown"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"
)

// returns a div element link to all-pages
func getAllPagesTemplate() string {
	headerTemplate := "<div> <a href='list-all' id='all-pages'> All pages </a> <div>"
	return headerTemplate
}

// parses the markdown file to HTML
// returns the HTML as string
func readMdFile(fileName string) string {
	if len(fileName) < 4 {
		fmt.Fprintf(os.Stderr, "readMdFile, invalid filename: %v\n", fileName)
	}
	data, err := ioutil.ReadFile(fileName)
	if err != nil {
		fmt.Fprintf(os.Stderr, "readMdFile: %v\n", err)
		return ""
	}
	parsedOutput := markdown.ToHTML(data, nil, nil)
	resp := getAllPagesTemplate()
	resp += string(parsedOutput)
	return resp
}

// list the Files with '.md' extension in current directory
// returns an html template list
func listFilesInDirectory(files []os.FileInfo) string {
	var str strings.Builder
	str.WriteString("<div><ul>")
	for _,f := range files {
		if !f.IsDir() {
			arr := strings.Split(f.Name(), ".")
			if arr[len(arr)-1] == "md" {
				li := "<li><a href='" + f.Name() + "'>" + f.Name() + "</a></li>"
				str.WriteString(li)
			}
		}
	}
	str.WriteString("</ul></div>")
	return str.String()
}

// start a server on localhost:8080, and listen for incoming connections
// TODO: make port variable?
// using https://stackoverflow.com/questions/43424787/how-to-use-next-available-port-in-http-listenandserve
func startServer() {
	fmt.Printf("Markdown docs serving at port 8080 \n")
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		fileName := r.URL.Path
		fmt.Printf("url path: %v\n", fileName)
		if fileName == "/" {
			fileName = "index.md"
		} else if fileName != "list-all" {
			fileName = fileName[1:]
		}

		arr := strings.Split(fileName, ".")
		filePath := arr[len(arr)-1]
		if filePath == "md" {
			fmt.Fprintf(w, readMdFile(fileName))
		} else if filePath == "list-all" {
			files, err := ioutil.ReadDir(".")
			if err != nil {
				fmt.Fprintf(os.Stderr, "error readDir: %v\n", err)
				fmt.Fprintf(w, "error. Cannot read directory")
				return
			}
			fmt.Fprintf(w, listFilesInDirectory(files))
		} else {
			data, err := ioutil.ReadFile(fileName)
			if err != nil {
				fmt.Fprintf(os.Stderr, "error readMdFile: %v\n", err)
				fmt.Fprintf(w, "file not found. Please check path")
				return
			}
			w.Write(data)
		}
	})
	log.Fatal(http.ListenAndServe(":8080", nil))
}

// check if config exists
// create new config if doesn't exist
// returns the config file
func loadConfig() {

}

func addToNotes() {
	loadConfig()

}

func removeFromNotes() {
}

func listNotes() {
}

func saveConfig() {

}

func showHelpUsage() {
	fmt.Printf("Not a valid option. Use either start, add, remove, list or no option\n")
}

func main() {

	if len(os.Args) == 1 {
		startServer()
	} else {
		switch os.Args[1] {
		case "start":
			startServer()
		case "add":
			addToNotes()
		case "remove":
			removeFromNotes()
		case "list":
			listNotes()
		default:
			showHelpUsage()
		}
	}
}
