package main

import (
	server "backend"
	"flag"
	"fmt"
	"log"
	"os"
)

func main() {
	var databaseDatasource string
	var port int

	flag.StringVar(&databaseDatasource, "databaseDatasource", "root:password@tcp(localhost:3306)/test", "Should looks like root:password@tcp(hostname:port)/dbname")
	flag.IntVar(&port, "port", 1991, "Web server port")
	flag.Parse()

	log.SetFlags(log.Ldate + log.Ltime + log.Lshortfile)
	log.SetOutput(os.Stdout)

	fmt.Println(databaseDatasource)
	fmt.Println(port)

	s := server.NewServer()
	if err := s.Init(databaseDatasource); err != nil {
		log.Fatal(err)
	}
	s.Run(port)
}
