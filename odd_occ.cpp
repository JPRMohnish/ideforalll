/* ********************************* JAI SAI RAM ************************************* */
#include<bits/stdc++.h>
using namespace std;
typedef long long int ll;

void solve()
{
    //all alphabets lowercase only 
  ll i,j,k,l,m,n,o,p,q,r,t,left,right;
  string s;
  string ans="NULL";
  left=-1;
  right=-1;
  string alphabets;
  cin>>s;
  cin>>alphabets;
  ll freq[26],prefix[26];
  memset(freq,0,sizeof(freq));
  memset(prefix,0,sizeof(prefix));
  for(auto c:alphabets)
  {
         freq[c-'a']++;
  }
  map<ll,ll> mp;
  mp[0]=-1;
  ll actual_length=0;
  for(i=0;i<s.length();i++)
  {
     m=s[i]-'a';
     prefix[m]++;
     l=0;
     ll val=0;
    for(j=0;j<26;j++)
     {
          if(freq[j])
          {
              val+=((prefix[j]%2)^1)*(1LL<<l);
              l++;
          }
     }
     if(mp.count(val))
     {
        
          if((i-(mp[val]))>actual_length)
          {
             // cout<<"Haha\n";
              actual_length=i-(mp[val]);
              left=mp[val]+1;
              right=i;
          }
     }
     //cout<<val<<" "<<i<<endl;
     val=0;
     l=0;
     for(j=0;j<26;j++)
     {
          if(freq[j])
          {
              val+=(prefix[j]%2)*(1LL<<l);
              l++;
          }
     }
    // cout<<val<<" "<<i<<endl;
     if(!mp.count(val))
     {
         mp[val]=i;
     }
  }
  if(left!=-1&&right!=-1)
  ans=s.substr(left,actual_length);
  cout<<ans<<endl;
}
int main()
{
    ll t;
    cin>>t;
    while(t--)
    {
        solve();
    }
    return 0;
}

