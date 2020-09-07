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
	return string(parsedOutput)
}

func main() {
	fmt.Printf("Markdown docs\n")
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fileName := r.URL.Path
		fmt.Printf("url path: %v\n", fileName)
		if fileName == "/" {
			fileName = "index.md"
		} else {
			fileName = fileName[1:]
		}

		arr := strings.Split(fileName, ".")
		filePath := arr[len(arr)-1]
		if filePath == "md" {
			fmt.Fprintf(w, readMdFile(fileName))
		} else {
			data, err := ioutil.ReadFile(fileName)
			if err != nil {
				fmt.Fprintf(os.Stderr, "readMdFile: %v\n", err)
				fmt.Fprintf(w, "")
				return
			}
			w.Write(data)
		}
	})
	log.Fatal(http.ListenAndServe(":8080", nil))
}
