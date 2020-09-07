# Markdown Docs

Write your notes / docs / whatever in Markdown. Easy formatting. Link pages. View the formatted HTML output in the browser.

## Advantages
1. Markdown (md) is easy to write. Easy to read in text editor as well as viewing formatted output in browser.
2. Link to other pages in the directory.
3. Self contrained documentation, not a global note-taking app. Focus on what you are working on.

Link to [other page](otherPage.md)


## How to run
1. Install go 1.15 +
2. go to any directory with atleast an index.md
```
$ go run mddocs.go
```
3. Your docs will be available at `localhost:8080`
