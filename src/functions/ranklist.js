import product from "../model/ranks.js";

async function createRanklist(){
const array = await product.find({type:"rank"})
let hero = ''
   for (let index = 0; index < array.length; index++) {
    const element = array[index];
    const banner = element.preview.Banner
    const title = element.name
    const short_desc = element.short_desc
    const product_id = element.product_id
    const old_price = element.price.amount
    const off = element.price.off
    const price = Math.floor(old_price - ((old_price/100)*off))


    const temp = `
      <div class="main2_feature" onclick="redi('${product_id}')">
        <img class="main2_feature_img" alt="Feature Image" src="${banner}">
        <a class="main2_feature_headline">${title}</a>
        <a class="main2_feature_text">${short_desc}</a>
        <span class="prize_box">
          <span class="off"><p class="percent_off"><b>${off}%</b>off</p><p class="old_prize">₹${old_price}</p></span>
          <h1 class="new_prize">₹${price}</h1>
        </span>
        <p class="read_more">Show More <img src="media/svg/arrow.svg" alt=""></p>
      </div>`
    hero = hero + temp
   }
   return hero
}

export default createRanklist;