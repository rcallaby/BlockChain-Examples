using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;


/* This is going to be the main file that will contain what I consider to be a very rudamentary and simple example of how to write
a blockchain in C# 

I was going to do my own implementation of a blockchain yet I found one already on github that I really liked so all credit really belongs to 
Ray Lu who holds the copyright to this code. Please be sure to check out the LICENSE file to see the conditions of this code under the MIT License.


*/

namespace RudamentaryBlock{

    class Program
    {
        static void Main(string[] args)
        {
            var myCoinBlockchain = new Blockchain();
            myCoinBlockchain.Difficulty = 3;

            Console.WriteLine("Mining a block...");
            myCoinBlockchain.AddBlock(new Block(1, "03/12/2017", "300"));

          
            myCoinBlockchain.ValidateChain();
            

            Console.WriteLine("Done");
            Console.ReadKey();
        }
}

}