#include<iostream>
using namespace std;

int main(){
    int x =1;
    while(true){
        int res = 32*x%17;
        if(res == 1){
            cout<<x;
            break;
        }
        else {
            x++;
        }
    }
}