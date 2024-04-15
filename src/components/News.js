import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner' 
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";


export class News extends Component {

  static defaultProps = {
    country:'in',
    pageSize:8,
    category:'genral'
  }

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category:PropTypes.string,
  }

  capetalizeFirstLetter = (string)=>{
    return string.charAt(0).toUpperCase()+string.slice(1);
  }

  constructor(props){
    super(props)                     //yha hamne this.state krke constructor islyea banaya hai kyuki ye mujhe yha articles,total result,and status ko state ka ek part banana hai jo ki constructor ke help se possible hai or ham state islyea banate hai kyuki koi vi variable bina page ko reload kie change ho or jo hame change krna hai usi ko this.state me rakhte hai 
    this.state={
      articles:[],
      loading:false,            //ye ek spinner hai
      page:1,
      totalResults:0
    }
    document.tittle=`${this.capetalizeFirstLetter(this.props.category)} - NewsMonkey`;
  }

  async updateNews(){
    const url =`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=9a3d5cdba8064930a55aa47b1b9fedc9&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({loading:true});
    let data = await fetch(url);            
    let parsedData = await data.json()    
    console.log(parsedData);
    this.setState({articles:parsedData.articles, 
      totalResults:parsedData.totalResults,
      loading:false,
    })
  }


   async componentDidMount(){ 
    this.updateNews();
    
    //async is a function jo ki hame cdm to fetch krne me hepp krta hai kuch promises ko jo ki hamne fetch ke dwara banaya hai
   /* let url =`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=9a3d5cdba8064930a55aa47b1b9fedc9&page=1&pageSize=${this.props.pageSize}`;
    this.setState({loading:true});
    let data = await fetch(url);              //ye news ko fetch krne me help krega
    let parsedData = await data.json()       //iska matlb jo data hame news api ke help se mil raha hai
    console.log(parsedData);
    this.setState({articles:parsedData.articles, 
      totalResults:parsedData.totalResults,
      loading:false
    })      */                                       //iska matlab jo state ka jo article hai or jo total article hai usko parse hone ke bad 
  }         


   handlePervClick= async ()=>{
   /* console.log("Previous");
    let url =`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=9a3d5cdba8064930a55aa47b1b9fedc9&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`;
    this.setState({loading:true});
    let data = await fetch(url);              
    let parsedData = await data.json()      
    console.log(parsedData);
    this.setState({
      page: this.state.page - 1,
      articles:parsedData.articles,
      loading:false  
    })         */
    this.setState({page:this.state.page-1});
    this.updateNews();
  }

  handlNextClick= async ()=>{
   // console.log("Next");
   // if(!(this.state.page + 1 > Math.ceil(this.state.totalResults/this.props.pageSize))) {                    
   // let url =`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=9a3d5cdba8064930a55aa47b1b9fedc9&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
   // this.setState({loading:true});
   // let data = await fetch(url);            
   // let parsedData = await data.json()               /*iska matlb next click krne ke bad age ka data show krwana*/     
   // this.setState({
   //   page: this.state.page + 1,
   //   articles:parsedData.articles,
   //   loading:false                   /*jab bhi age ka data aa jiye to loading ko khatm kr do*/
   // })      
   //   }   
     this.setState({page:this.state.page+1});
     this.updateNews();
}

fetchMoreData = async() => {
    this.setState({ page: this.state.page+1 });
    const url =`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=9a3d5cdba8064930a55aa47b1b9fedc9&page=${this.state.page}&pageSize=${this.props.pageSize}`;

    let data = await fetch(url);            
    let parsedData = await data.json()    
    console.log(parsedData);
    this.setState({
      articles:this.state.articles.concat(parsedData.articles), 
      totalResults:parsedData.totalResults,
    
    })
    
};

  

  render() {
    return (
      <>
        <h1 className="text-center" style={{margin:'30px 0px'}}>NewsMonkey - Top {this.capetalizeFirstLetter(this.props.category)} Headlines </h1>  
        {this.state.loading && <Spinner/>}             {/*iska matlab this.state.loading agar true hai && to hi aap spinner ko show kre warna na kre*/}

       <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length!== this.state.totalResults}
          loader={<Spinner/>}
        >
          <div className='container'>
        <div className="row">
        {this.state.articles.map((element)=>{                       /*this.state.loading && iska matlb agar loading true hai to apko kuch ni dikhega agar false hai t spinner ni dikhega */ 
        return <div className="col-md-4" key={element.url}>     {/*this is the javascript class which will split the card into colum 4*/}
        <NewsItem title={element.title?element.title:""} description={element.description?element.description:""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>  {/*this will show my card which we will copy from bootstrap and in card it will show all the details given below    --after that we define a key thats wahy we have to put the variables in the element.______ pair to render the methods*/          /*element.title? iak Mtlab ternary opetaor means id else type hota hai " "*/ }
        </div>
        })}
        </div>
        </div>
        
        </InfiniteScroll>
        {/*<div className="container d-flex justify-content-between">
        <button disabled={this.state.page<=1} type="button" className="btn btn-dark"onClick={this.handlePervClick}>&larr; Previous</button>
        <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handlNextClick}>Next &rarr;</button>
      </div>*/}
      </>
    )
  }
}

export default News