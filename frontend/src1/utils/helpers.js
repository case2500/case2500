export const formatPrice = (number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(number / 100)
}


// const categories = getUniqueValues(all_products, 'category') //all,office,living room,kitchen,bedroom,dining,kids
// const companies = getUniqueValues(all_products, 'company')  //all,marcos,liddy,ikea,caressa
// const colors = getUniqueValues(all_products, 'colors') //

export const getUniqueValues = (data, type) => {
  let unique = data.map((item) => item[type])
  //alert(unique)
  if (type === 'colors') {
    unique = unique.flat()
  }
  return ['all', ...new Set(unique)]
}

// const nested = [ ['📦', '📦'], ['📦']];
// const flattened = nested.flat();
// console.log(flattened);
// // ['📦', '📦', '📦']



// let arr =   [
//   [
//     "s1@example.com",
//     "s2@example.com"
//   ],
//   [
//     "s1@example.com",
//     "s3@example.com"
//   ]
// ]

// let arr2 = [...new Set(arr.flat(1))];
// console.log(arr2)