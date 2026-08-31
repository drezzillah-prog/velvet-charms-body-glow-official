/* Velvet Charms Body Glow — reference-photo scope.
   Additive safeguard: photo uploads are offered only for Candles, Soaps,
   and Knitted & Braided Wool Creations. Other customization remains intact. */
(()=>{
'use strict';
const PHOTO_CATEGORIES=new Set(['Candles','Soaps','Knitted & Braided Wool Creations']);

function categoryForProduct(productId){
  for(const category of (window.VELVET_CATALOGUE?.categories||[])){
    if((category.products||[]).some(product=>product.id===productId))return category;
    for(const subcategory of (category.subcategories||[])){
      if((subcategory.products||[]).some(product=>product.id===productId))return category;
    }
  }
  return null;
}

function allowsPhotos(productId){
  const category=categoryForProduct(productId);
  return Boolean(category&&PHOTO_CATEGORIES.has(category.name));
}

function configurePhotoStep(){
  const form=document.querySelector('[data-custom-form]');
  if(!form?.dataset.productId)return;
  const enabled=allowsPhotos(form.dataset.productId);
  form.dataset.referencePhotosEnabled=enabled?'true':'false';
  const photoStep=document.querySelector('[data-custom-step="2"]');
  const photoIndicator=document.querySelector('[data-step-indicator="2"]');
  const firstNext=document.querySelector('[data-custom-step="1"] [data-custom-next]');
  if(photoIndicator)photoIndicator.hidden=!enabled;
  if(photoStep)photoStep.dataset.photoEligible=enabled?'true':'false';
  if(firstNext)firstNext.textContent=enabled?'Continue to photos':'Review customization';
  if(!enabled){
    const input=form.elements.reference_photos;
    if(input)input.value='';
  }
}

/* Customize buttons are handled by features.js first; configure immediately after it opens. */
document.addEventListener('click',event=>{
  if(event.target.closest('[data-customize]')||event.target.closest('[data-cart-edit]')){
    setTimeout(configurePhotoStep,0);
  }
});

/* For non-photo products, transparently skip the existing Photos step. */
document.addEventListener('click',event=>{
  const next=event.target.closest('[data-custom-next]');
  if(!next)return;
  const form=document.querySelector('[data-custom-form]');
  if(form?.dataset.referencePhotosEnabled!=='false')return;
  if(next.closest('[data-custom-step="1"]')){
    setTimeout(()=>{
      const photoStep=document.querySelector('[data-custom-step="2"]');
      if(!photoStep||photoStep.hidden)return;
      const reviewButton=photoStep.querySelector('[data-custom-next]');
      if(reviewButton)reviewButton.click();
    },0);
  }
});
})();
