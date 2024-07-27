import { cart, removeFromCart, updateDeliveryOption  } from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js' ;
import { deliveryOptions, getDeliveryOption } from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";

export function renderOrderSummary(){  let cartSummaryHTML = '';
    cart.forEach((item) => {
        const productId = item.productId;

        const matchingProduct = getProduct(productId);

        const deliveryOptionId = item.deliveryOptionId;

        const deliveryOption = getDeliveryOption();
        
        const today = dayjs();
        const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');

        const dateString = deliveryDate.format('dddd, MMMM D'); // Ensure correct format

        cartSummaryHTML += `
        <div class="cart-item-container js-cart-item-container js-cart-item-container-${matchingProduct.id} ">
                <div class="delivery-date">
                  Delivery date: ${deliveryDate}
                </div>

                <div class="cart-item-details-grid">
                  <img class="product-image"
                    src="${matchingProduct.image}">

                  <div class="cart-item-details">
                    <div class="product-name">
                      ${matchingProduct.name}
                    </div>
                    <div class="product-price">
                      $${(formatCurrency(matchingProduct.priceCents))}
                    </div>
                    <div class="product-quantity js-product-quantity-${matchingProduct.id}">
                      <span>
                        Quantity: <span class="quantity-label"> ${item.quantity} </span>
                      </span>
                      <span class="update-quantity-link link-primary">
                        Update
                      </span>
                      <span class="delete-quantity-link link-primary js-delete-quantity-link js-delete-quantity-link-${matchingProduct.id}" data-product-id = "${matchingProduct.id}">
                        Delete
                      </span>
                    </div>
                  </div>

                  <div class="delivery-options">
                    <div class="delivery-options-title">
                      Choose a delivery option:
                    </div>

                    ${deliveryOptionsHTML(matchingProduct, item)}
                  
                  </div>
                </div>
              </div>`;
    });

    function deliveryOptionsHTML(matchingProduct, item){
      let html = '';
      deliveryOptions.forEach((deliveryOption)=>{
        const today = dayjs();
        const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
        const dateString = deliveryDate.format('dddd, MMMM D');
        const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} - `;

        const isChecked = deliveryOption.id === item.deliveryOptionId;
        html += `<div class="delivery-option js-delivery-option" data-product-id = 
            ${matchingProduct.id} data-delivery-option-id = ${deliveryOption.id}>
          <input type="radio" 
            ${isChecked ? 'checked' : ''}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceString}
            </div>
          </div>
        </div>
        `
      });

      return html;
    }

    document.querySelector('.order-summary').innerHTML = cartSummaryHTML;
    document.querySelectorAll('.js-delete-quantity-link').forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            removeFromCart(productId);
            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            container.remove();
            renderPaymentSummary();
        });
        
    });


    document.querySelectorAll('.js-delivery-option').forEach((element)=>{
      element.addEventListener('click', () => {
        const {productId, deliveryOptionId} = element.dataset;
        updateDeliveryOption(productId,deliveryOptionId);
        renderOrderSummary();
        renderPaymentSummary();
      });
    });
}

