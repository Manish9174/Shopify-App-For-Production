import { authenticate } from "../shopify.server";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const frmdata = await request.formData();
  const ttle = frmdata.get("title");


  
  //const { admin } = await authenticate.admin(actms);
  //const material = ["Satin","Cotton","Fabric","Woolen"][Math.floor(Math.random()*4)];
  //alert(material);

const response = await admin.graphql(`
  mutation createProduct_ms {
    productCreate(input: {
      title: "${ttle}"
    }) {
      product {
        id
        title
        status
        variants(first: 1) {
          edges {
            node {
              id
              price
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`);

    
  const retjson = await response.json();
  return{
    product: retjson.data.productCreate.product,
    errors: retjson.data.productCreate.userErrors
  }
}

export default function newms() {

  // const [headingtx, settext] = useState("Notification MS");
  // const [inputtxt, inputset] = useState("Field Name");

   const fetcher_ms = useFetcher(); // for connect from backend to frontend
   const shopify_ms = useAppBridge();
   
  //dynamic product title
  const [prdtitle, setprdttle] = useState("");




  //  const msclicked=()=>{
  //   //alert();
  //   //console.log("clicked");
    
  //   settext(inputtxt);
    
  //  }



const isLoading =  fetcher_ms.state === 'submitting' ||  fetcher_ms.state === 'loading';

   //success toast
   useEffect(()=>{   
   
    //it will work when the product is created
    if(fetcher_ms.data?.product?.id){
      shopify_ms.toast.show("Product created by Manish!");
    }
  }, [fetcher_ms.data?.product?.id, shopify_ms] );


  const crtePrdct = () => {
    fetcher_ms.submit({
      title : prdtitle
    }, {
      method:"POST"
    });
  };
  
   
  

    return(   
     
        <>
        
{/* <h1>{headingtx}</h1>
<input placeholder="Enter field name" type="text" value={inputtxt} onChange={(evt)=>{
  const val = evt.target.value;
  inputset(val);
}}/> */}
<br></br>
<br></br>

{/* <s-button-group>
  <s-button slot="primary-action" onClick={msclicked}>Enter the field name</s-button>
</s-button-group> */}

<s-page>
  <s-section>

    {/* // product title */}
{/* <input
  type="text"
  placeholder="Enter product title"
  value={prdtitle}
  onChange={(e) => setprdttle(e.target.value)}
/> */}

<s-paragraph>
  <s-text type="strong">Enter Product Title: </s-text>

</s-paragraph>

<s-text-field
type="text"
  placeholder="Enter product title"
  value={prdtitle}
  onChange={(e) => setprdttle(e.target.value)}
 />


    <s-button onClick={crtePrdct} {...(isLoading?{loading:true}:{})}>
 Create Product By Manish's app!
    </s-button>
  </s-section>

      {/* ✅ Response UI (same as Shopify template) */}
      {fetcher_ms.data?.product && (
        <s-section heading="Product Create Response  By MS">
          <s-box padding="base" borderWidth="base" borderRadius="base" background="subdued">
            
            <pre style={{ margin:0 }}>
              <code>
                {JSON.stringify(fetcher_ms.data.product, null, 2)}
              </code>
            </pre>
          </s-box>
                  </s-section>
      )}
      {/* Errors (if any) */}

      {fetcher_ms.data?.errors?.length > 0 && (
<s-section heading="Errors">
        <pre>
          {JSON.stringify(fetcher_ms.data.errors, null, 2)}
        </pre>
      </s-section>

      )}
      

</s-page>

</>

    );
  }