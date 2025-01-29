export const introduction = `

![cover](/assets/documentation/get-started/introduction.png)

### Introduction of the GBB/AI Platform

---

<br/>

**The GBB/AI platform is a solution native to Azure. It utilizes Azure OpenAI (\`AOAI\`) capabilities along with a variety of other services, including:**

- Azure Cosmos DB
- Azure AI Search
- Document Intelligence
- Function App
- Others

<br/>

This design provides a comprehensive approach to the \`development\`, \`deployment\`, and \`management\` of customer-created AOAI-related services and applications.

---

This platform primarily serves two major purposes:

- \`External\`: It provides a template that aids enterprise customers in swiftly implementing Proof of Concepts (**PoCs**) and Minimum Viable Products (**MVPs**).
- \`Internal\`: It serves as a demonstration tool for field colleagues and partners to exhibit the capabilities of AOAI to customers and stimulate their imagination.
`;

export const setupToUse = `
### Setup to use
<br/>

To get started with the GBB/AI platform, you first need an active Azure account. 

After obtaining one, visit the Azure portal and follow the setup instructions provided below.

<br/>

---

<br/>

**Step 1: Create an Azure OpenAI (AOAI) resource in [Azure Portal](https://portal.azure.com/)**

<br/>

<br/>

**Step 2: Obtain AOAI credentials from the Azure OpenAI Console**

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/get-started/setup_endpoint.png)

  </div>
</div>

**Step 3: Create AOAI deployments in [Azure OpenAI Studio](https://oai.azure.com/)**
<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  1. To use Retrieval Augmented Generation (RAG) with your own data, you need to create a \`text-embedding-ada-002\` deployment.
  2. To experiment with GPT in a vision context, deploy a multi-modal GPT-4 model such as \`gpt-4o\`.

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/get-started/setup_deployment.png)

  </div>
</div>

<br/>

**Step 4: Create a resource in the GBB/AI platform with your credentials**

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  1. The resource name must be **unique**.
  2. If you add multiple GPT resources, you can set one of them as the \`primary\` option by clicking the button on the top right in the **User/Account** page.
  3. Avoid adding multiple Embedding resources. If you add multiple Embedding resources, only the first one will be used. 

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/get-started/setup_resource.png)

  \`\`\`text
  New resource
    ├─ Resource name: unique string
    ├─ Endpoint: the url obtained in step 2
    ├─ Deployment: the one created in step 3
    ├─ Model: model name in step 3
    ├─ Key: the key obtained in step 2
    ├─ API version: api version
  \`\`\`

  </div>
</div>
`;
