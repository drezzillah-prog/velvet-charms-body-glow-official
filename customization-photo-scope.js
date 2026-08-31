/* Velvet Charms Body Glow — reference-photo scope.
   Additive safeguard: reference photos are offered only where a visual reference is useful. */
(()=>{
'use strict';
const PHOTO_CATEGORIES=new Set([
  'Candles',
  'Soaps',
  'Knitted & Braided Wool Creations',
  'Bundles'
]);

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

function hidePhotoLineFromReview(){
  const form=document.querySelector('[data-custom-form]');
  if(form?.dataset.referencePhotosEnabled!=='false')return;
  const review=document.querySelector('[data-custom-review]');
  if(!review)return;
  [...review.querySelectorAll('p')].forEach(node=>{
    if(/private reference photo/i.test(node.textContent||''))node.remove();
  });
}

function configurePhotoStep(){
  const form=document.querySelector('[data-custom-form]');
  if(!form?.dataset.productId)return;

  const enabled=allowsPhotos(form.dataset.productId);
  form.dataset.referencePhotosEnabled=enabled?'true':'false';

  const photoStep=document.querySelector('[data-custom-step="2"]');
  const photoIndicator=document.querySelector('[data-step-indicator="2"]');
  const reviewIndicator=document.querySelector('[data-step-indicator="3"]');
  const firstNext=document.querySelector('[data-custom-step="1"] [data-custom-next]');
  const photoField=document.querySelector('.custom-photo-field');
  const photoPreview=document.querySelector('[data-custom-photo-preview]');
  const uploadStatus=document.querySelector('[data-custom-upload-status]');

  if(photoIndicator)photoIndicator.hidden=!enabled;
  if(reviewIndicator)reviewIndicator.textContent=enabled?'3. Review':'2. Review';
  if(photoStep){
    photoStep.dataset.photoEligible=enabled?'true':'false';
    if(!enabled)photoStep.style.display='none';
    else photoStep.style.removeProperty('display');
  }
  if(photoField)photoField.hidden=!enabled;
  if(photoPreview)photoPreview.hidden=!enabled;
  if(uploadStatus)uploadStatus.hidden=!enabled;
  if(firstNext)firstNext.textContent=enabled?'Continue to photos':'Review customization';

  if(!enabled){
    const input=form.elements.reference_photos;
    if(input)input.value='';
    hidePhotoLineFromReview();
  }
}

/* features.js creates the modal once and sets productId whenever Customize/Edit opens. */
document.addEventListener('click',event=>{
  if(event.target.closest('[data-customize-product]')||event.target.closest('[data-cart-edit]')){
    setTimeout(configurePhotoStep,0);
  }
});

/* Non-photo products keep the existing validated workflow but skip the hidden Photos step. */
document.addEventListener('click',event=>{
  const form=document.querySelector('[data-custom-form]');
  if(form?.dataset.referencePhotosEnabled!=='false')return;

  const next=event.target.closest('[data-custom-next]');
  if(next&&next.closest('[data-custom-step="1"]')){
    setTimeout(()=>{
      const photoStep=document.querySelector('[data-custom-step="2"]');
      const reviewButton=photoStep?.querySelector('[data-custom-next]');
      if(reviewButton)reviewButton.click();
      setTimeout(hidePhotoLineFromReview,0);
    },0);
    return;
  }

  const previous=event.target.closest('[data-custom-prev]');
  if(previous&&previous.closest('[data-custom-step="3"]')){
    setTimeout(()=>{
      const photoStep=document.querySelector('[data-custom-step="2"]');
      const backButton=photoStep?.querySelector('[data-custom-prev]');
      if(backButton)backButton.click();
    },0);
  }
});

/* Re-apply after catalogue render so the rule remains deterministic on async catalogue load. */
document.addEventListener('velvet:catalogue-rendered',()=>setTimeout(configurePhotoStep,0));
})();
