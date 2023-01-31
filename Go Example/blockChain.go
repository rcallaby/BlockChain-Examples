package main

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"strconv"
	"strings"
	"time"
)

// Block represents a block in the blockchain
type Block struct {
	Index        int
	Timestamp    int64
	Data         string
	PreviousHash string
	Hash         string
}

// Blockchain is a list of blocks
var Blockchain []Block

// CalculateHash calculates the hash of a block
func CalculateHash(block Block) string {
	record := strconv.Itoa(block.Index) + strconv.FormatInt(block.Timestamp, 10) + block.Data + block.PreviousHash
	h := sha256.New()
	h.Write([]byte(record))
	hashed := h.Sum(nil)
	return hex.EncodeToString(hashed)
}

// GenerateBlock generates a new block
func GenerateBlock(oldBlock Block, data string) Block {
	newBlock := Block{}
	newBlock.Index = oldBlock.Index + 1
	newBlock.Timestamp = time.Now().Unix()
	newBlock.Data = data
	newBlock.PreviousHash = oldBlock.Hash
	newBlock.Hash = CalculateHash(newBlock)
	return newBlock
}

// IsBlockValid checks if a block is valid
func IsBlockValid(newBlock, oldBlock Block) bool {
	if oldBlock.Index+1 != newBlock.Index {
		return false
	}
	if oldBlock.Hash != newBlock.PreviousHash {
		return false
	}
	if CalculateHash(newBlock) != newBlock.Hash {
		return false
	}
	return true
}

// ReplaceChain replaces the blockchain with a new one if it is valid and longer
func ReplaceChain(newBlocks []Block) {
	if len(newBlocks) > len(Blockchain) {
		Blockchain = newBlocks
	}
}

func main() {
	Blockchain = append(Blockchain, Block{0, time.Now().Unix(), "Genesis Block", "", ""})
	fmt.Println("Blockchain:", Blockchain)
	data := "Send 1 BTC to Alice"
	newBlock := GenerateBlock(Blockchain[len(Blockchain)-1], data)
	if IsBlockValid(newBlock, Blockchain[len(Blockchain)-1]) {
		Blockchain = append(Blockchain, newBlock)
		fmt.Println("Blockchain:", Blockchain)
	} else {
		fmt.Println("Invalid block")
	}
}
