export default class Hsl{
  constructor(h,s,l){
    this.h = h
    this.s = s
    this.l = l
  }
  lto(newl){
    return new Hsl(this.h,this.s,newl)
  }
  sto(news){
    return new Hsl(this.h,news,this.l)
  }
  hto(newh){
    return new Hsl(newh,this.s,this.l)
  }
  str(){
    return `hsl(${this.h}, ${this.s * 100}%, ${this.l * 100}%)`
  }
}