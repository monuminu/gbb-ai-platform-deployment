import{e as x,v as b,j as t,W as w,w as k,S as A}from"./index-f7c4dfad.js";import{u as T}from"./use-params-075b74e1.js";import{a as C}from"./documentation-e657c1e8.js";import{M as I}from"./markdown-e1ecb202.js";import{E as P}from"./image-f9ea5de7.js";import{S as d}from"./index-8fda52a8.js";const S=`
### v1.0.0
###### May 1, 2024

- Add **Knowledge Base Management** module for creating and managing the Knowledge Base.
- Add **Function/tool management** module (Preview)
- Add **Custom GPTs** module
- Add **Applications** module
- Add \`AOAI Workbench\` application
- Add \`TV Copilot\` application
- Add \`AI Data Analyzer\` application
- Add \`Chat with Web\` feature to the **AOAI Workbench** application, under the "Open-chat" mode.
`,G=`
### Functions
<br/>

- This module is designed to help users manage functions more effectively.
- Function calling is an effective way to bridge the gap between GPT and existing tools like APIs.
- Additionally, it features a Copilot to aid customers in creating functions and their descriptions.

<br/>

---

<br/>

**Dashboard**

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  - It acts as the function market, providing a comprehensive metric overview of all functions.
  - It includes a function list that details all active functions for simplified monitoring and management.

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/fmm/0.png)

  </div>
</div>

**Function detail**

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  - Provides transparency to inform and empower users.
  - Facilitates understanding and enhancement of functions.
  - \`Function Copilot\` can be invoked to perform specific tasks.

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/fmm/1.png)

  </div>
</div>


**Function description**

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  - The description needs to be concise for GPT to accurately differentiate it from other functions.
  - It is highly recommended to use \`Function Copilot\` to help generate the description.
  - \`Function Copilot\` will consider the function code while generating the description.

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/fmm/2.png)

  </div>
</div>
`,L=`
### Create a knowledge base
<br/>

Creating a knowledge base on the GBB/AI Platform is a simple and straightforward process. 

With intuitive interfaces and comprehensive guides, even beginners can easily navigate the platform.

<br/>

---

<br/>

**Step 1: Click the \`+ Knowledge\` button to create a knowledge base**

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">
  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/kmm/create-kb.png)

  </div>
</div>

<br/>

**Step 2: Click the \`+ Source\` button to add documents**

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  1. After clicking the \`Upload\` button, the files will be uploaded to Azure Storage. 
  2. On the interface, the status of each file will initially display \`Preparing...\` and will change to \`Uploaded\` once the upload is successful.

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/kmm/add-source.png)

  </div>
</div>

**Step 3: Select files and generate knowledge**

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  1. Select the files you want to generate knowledge from by clicking the checkbox next to them. Then, click the \`Index\` button.
  2. Initially, each file's status will display as \`Preparing...\`. This will change to \`Indexing...\` when the data processing job begins.
  3. After the job is completed, the status will update to \`Indexed\`.
  4. If the job fails, the status will show \`Failed\`. You can view the error message by hovering over the \`Failed\` tag.

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/kmm/create-index.png)

  </div>
</div>

<br/>

After generating your knowledge, you can interact with it through a chat. For more information, please refer to the **Chat With KB** chapter.

<br/>
`,B=`
### Chat with a knowledge base (KB)
<br/>

After generating knowledge, you can begin to ask questions or request information from the knowledge base.

<br/>

---

#### Prerequisites

- Before interacting with a KB, ensure you have added the necessary AOAI resources. 
- If you haven't done so, please visit the **Setup To Use** chapter and follow the guide.
- Ensure you have added a \`text-embedding-ada-002\` resource and a \`gpt\` resource.

<br/>

---

**Method 1: Select a KB from the list to chat with**

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  - Please select only one knowledge base to chat with.
  - If you select multiple knowledge bases, only one of them will be used for the chat.

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/kmm/chat-kb.png)

  </div>
</div>

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  - In the copilot sidebar, you can either click the \`Send\` button or press \`CTRL/CMD + Enter\` to send a question.
  - In the copilot sidebar, you can clear chat history by clicking the \`Sweep\` button.

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/kmm/chat-kb-copilot.png)

  </div>
</div>

<br/>

**Method 2: Select files within a KB to chat with**

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  - You can access the Copilot sidebar within a KB for chat.
  - Please note that currently, selecting files doesn't have any effect. **You always chat with the entire KB**.
  - The feature **Chat with selected files** will be supported in the future.

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/kmm/chat-kb-copilot2.png)

  </div>
</div>

<br/>

**Method 3: Chat with a KB in the AOAI workbench**

<br/>

Please visit the **AOAI Workbench** chapter and follow the guide.
`,q=`

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
`,O=`
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
`,F=`
### Create a custom GPT
<br/>

The process of creating a custom GPT on the GBB/AI Platform is simple and direct. 

Even beginners without a technical background can easily navigate the platform, thanks to intuitive interfaces and the assistance of the built-in "Copilot".

<br/>

---

#### Prerequisites

- Before proceeding, ensure you have added the necessary AOAI resources. 
- If you haven't done so, please visit the **Setup To Use** chapter and follow the guide.

---

**Step 1: Click the \`+ GPT\` button to enter the page**

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">
  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/gpts/create-gpt.png)

  </div>
</div>

<br/>

**Step 2: Enter the required information on the configuration page**

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  1. The required inputs include: \`GPT name\`, \`Description\`, \`System prompt\`, \`Category\`, and \`Cover image\`. 
  2. After naming the GPT, you can invoke "Copilot" to assist in generating the necessary inputs.

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/gpts/create-gpt2.png)

  </div>
</div>

**Step 3: Attach a Knowledge Base or Function to your GPT**

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  1. You can equip your GPT with domain knowledge by selecting a knowledge base from the drop-down list. (Refer to the **Create A KB** section to learn how to create a knowledge base).
  2. You also have the option to attach one or more functions to your GPT, such as \`bing_search\` and \`draw\`.
  3. At present, we recommend **NOT** attaching a KB or Function simultaneously.

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/gpts/create-gpt3.png)

  </div>
</div>

<br/>

**Step 4: Test your GPT**

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  1. Once you've input all the required information, you can test your GPT in Chat Bench.

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/gpts/create-gpt4.png)

  </div>
</div>

<br/>

**Step 5: Preview and upload your GPT**

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  1. You can preview your GPT and interact with it through chat.
  2. Click \`Cancel\` to leave Preview mode.
  3. In the top right corner, hit the \`Upload\` button to upload your GPT.

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/gpts/create-gpt5.png)

  </div>
</div>
`,z=`
### Orchestrate Custom GPTs
<br/>

After creating several custom GPTs, you can arrange and coordinate these GPTs with various skills to complete a complex task.
<br/>
In this tutorial, we will create an Amazon listing document that includes both text and images.

<br/>

---

#### Prerequisites

- Before proceeding, ensure you have added the necessary AOAI resources. 
- If you haven't done so, please visit the **Setup To Use** chapter and follow the guide.

---

**Step 1: Click the \`Workbench\` button to enter GPTs orchestration page**

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">
  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/gpts/orchestrate-gpts1.png)

  </div>
</div>

**Step 2: Select a custom GPT**
<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  1. You can access the custom GPT popover by clicking the round button in the input box or by typing the \`@\` symbol within it.
  2. In the popover, scroll up and down to select your custom GPT, or find it by searching for its name.

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/gpts/orchestrate-gpts2.png)

  </div>
</div>


**Step 3: Utilize built-in sample prompts**
<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  1. If you provided sample prompts when creating your custom GPT, you can access them by clicking the Bulb button.

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/gpts/orchestrate-gpts3.png)

  </div>
</div>

<br/>

**Step 4: Switch to the \`Paint Guru\` gpt to create an image**

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  1. Select the \`Paint Guru\` GPT from the list.
  2. Input _Craft an image reflecting the content above._
  3. Wait for the image to be generated.

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/gpts/orchestrate-gpts4.png)

  </div>
</div>
`,D=`
### AOAI Workbench
<br/>

This is a playground for testing and interacting with AOAI resources. 

Here, you can engage with a knowledge base, experiment with function calls, and explore much more.

<br/>

---

#### Prerequisites

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  - Ensure you have added the necessary AOAI resources. If you haven't done so, please visit the **Setup To Use** chapter and follow the guide.
  - Ensure you have added a \`text-embedding-ada-002\` resource if you plan to chat with KB.
  - You can open the **Configuration** dialog by clicking the gear icon on the top right. Here, you can configure the settings for the each mode.
 
  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/applications/aoai-workbench/aoai-workbench-0.png)

  </div>
</div>

---

<br/>

**Mode 1: Open chat**

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  - You can instantly chat with GPT by clicking one of the three sample questions.
  - More sample questions can be found by clicking the \`Bulb\` button on the bottom left.

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/applications/aoai-workbench/aoai-workbench-1.png)

  </div>
</div>

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  - You can chat with GPT using information from a website by simply adding the website's URL (See Figure 2 on the right).

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/applications/aoai-workbench/aoai-workbench-2.png)

  </div>
</div>

<br/>

**Mode 2: RAG**

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  - To select a knowledge base (KB), click the folder button or enter the \`#\` symbol in the input box.
  - You can either use the search box in the popover to look for a KB or enter text after the \`#\` symbol.

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/applications/aoai-workbench/rag-0.png)

  </div>
</div>

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  - In the configuration panel, you can change the default parameters by navigating to the RAG section.
  - Experiment with different \`Retrieve modes\`, enable or disable the \`Semantic ranker\`, and adjust the \`Retrieve chunk\` count as needed.

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/applications/aoai-workbench/rag-1.png)

  </div>
</div>

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  - Click the \`Sources\` button to view the chunks GPT uses to generate the answer.
  - The "Sources" panel displays the \`Reranker score\`, \`Search score\`, and other details.
  - Unfold all chunks to see their contents.

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/applications/aoai-workbench/rag-2.png)
  ![cover](/assets/documentation/applications/aoai-workbench/rag-3.png)

  </div>
</div>

<br/>

**Mode 3: Function calling**

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  - You can enhance the capabilities of GPT by incorporating built-in functions like bing_search, draw, get_stock_data, and others.

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/applications/aoai-workbench/function-calling-0.png)

  </div>
</div>
`,M=`
### TV Copilot
<br/>

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  - This application allows you to interact with your television content using GPT.
  - You can ask GPT questions about the show you're watching, request recommendations, search for information, create content and many more.

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/applications/tv-copilot/1.png)

  </div>
</div>

---

#### Prerequisites

- Ensure you have added the necessary AOAI resources. If you haven't done so, please visit the **Setup To Use** chapter and follow the guide.
- You can open the **Configuration** dialog by clicking the gear icon on the top right. Here, you can configure the settings for the each mode.

---

<br/>

**Demo 1: Inquire about dresses and ask for recommendations**

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  - From the home page, click on the second video and then press the \`Play\` button.
  - Ensure you are in \`Open-chat\` mode and that the image button is selected.
  - Pause at the scene where you need TV Copilot’s assistance.
  - Send your question to TV Copilot.

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/applications/tv-copilot/2.png)

  </div>
</div>

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  - To find similar clothing, enter \`Function Calling\` mode by clicking the \`mode button\` or typing \`CMD/CTRL + u\` in the input box.
  - Deselect the \`image button\` by clicking it or typing \`CMD/CTRL + i\` in the input box.
  - Submit your query to TV Copilot.

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/applications/tv-copilot/3.png)

  </div>
</div>

<br/>

**Demo 2: Search for restaurants and make a reservation**

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  - From the home page, click on the third video and press the Play button.
  - Pause at the scene where an appealing dish appears.
  - Switch to \`Function Calling\` mode and ask TV Copilot to search for restaurants.
  - Request TV Copilot to book a restaurant.

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/applications/tv-copilot/4.png)
  ![cover](/assets/documentation/applications/tv-copilot/5.png)

  </div>
</div>

<br/>

**Demo 3: Obtain sports Information**

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  - Start from the home page, click on the first video and then press the Play button.
  - Transition to Function Calling mode and request TV Copilot to retrieve the information.

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/applications/tv-copilot/6.png)

  </div>
</div>

<br/>

**Demo 4: Create content based on your favorite scene**

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  - Start from the home page, click on the fourth video and then press the Play button.
  - Transition to Open-chat mode and ensure the image button is selected. Ask TV Copilot to describe the scene.
  - Transition to Function Calling mode and deselect the image button. Request TV Copilot to generate content.

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/applications/tv-copilot/7.png)
  ![cover](/assets/documentation/applications/tv-copilot/8.png)

  </div>
</div>
`,R=`
### AI Data Analyzer
<br/>

- With AI Data Analyzer, you can analyze your data using natural language.
- Currently, it supports \`CSV\`, \`TSV\`, and \`XLSX\` formats. 
- In the future, it will support interactions with databases such as \`MySQL\` and \`PostgreSQL\`.

<br/>

---

#### Prerequisites

- Ensure you have added the necessary AOAI resources (**GPT-4o is strongly recommended**).
- If you haven't done so, please visit the **Setup To Use** chapter and follow the guide.
- You can download the sample data file from **[here](https://www.kaggle.com/datasets/ranitsarkar01/yulu-bike-sharing-data)**.

---

<br/>

**Demo 1: Inquire about data schema**

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  - Upload the **yulu_bike_sharing_dataset.csv** file from your local disk.
  - Select a file from the file panel, input your query in the panel at the bottom, and then click the \`send\` button or press \`CTRL/CMD + Enter\`.
  - The query could be: _What columns are included in this dataset?_

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/applications/chat-da/0.png)

  </div>
</div>

<br/>

**Demo 2: Perform data operations and visualization**

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  - Ensure the file **yulu_bike_sharing_dataset.csv** is selected.
  - The query could be: _Get the data of registered users in the days of week from Monday to Sunday_

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/applications/chat-da/1.png)

  </div>
</div>

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  - Click the \`chart type\` button located in the top right corner and choose a different chart type.

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/applications/chat-da/2.png)

  </div>
</div>

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  - Click the \`Code\` button in the bottom left corner to view the code generated by GPT and executed in the backend.

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/applications/chat-da/3.png)

  </div>
</div>

<br/>

**Demo 3: Analyze data across multiple files**

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  - Upload the **photos.xlsx** and **users.xlsx** files from your local disk.
  - Ensure both files are selected.
  - The query could be: _How many photos were uploaded by John?_
  - Click the \`Code\` button to view the codes.
  - Substitute **John** with other names in the **users.xlsx** file.

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/applications/chat-da/4.png)

  </div>
</div>

<br/>

**Demo 4: Generate data insights**

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  - Select one or multiple data cards by clicking the radio button next to the query.
  - Click the \`Insights\` button located at the bottom right corner to generate data insights.

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/applications/chat-da/6.png)

  </div>
</div>

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  - View the complete report by clicking the \`Report\` button.
  - You also have the option to interact with the data on the report page.

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/applications/chat-da/7.png)
  ![cover](/assets/documentation/applications/chat-da/8.png)

  </div>
</div>

---

#### Tips

<div style="display: flex;">
  <div style="flex: 1; margin-right: 10px;">

  - There's no need to wait for one query to finish. You can execute multiple queries simultaneously.
  - If you receive a **Failure** message, please attempt again by clicking the \`Refresh\` button next to the query.
  - You can adjust the query and execute it again by clicking the \`Refresh\` button next to the query.

  </div>
  <div style="flex: 1; margin-left: 10px;">

  ![cover](/assets/documentation/applications/chat-da/5.png)

  </div>
</div>

`;function _(e){return e==="introduction"?{localcontent:q,isLoadingLocal:!1}:e==="setup-to-use"?{localcontent:O,isLoadingLocal:!1}:e==="changelog"?{localcontent:S,isLoadingLocal:!1}:e==="functions-preview"?{localcontent:G,isLoadingLocal:!1}:e==="create-kb"?{localcontent:L,isLoadingLocal:!1}:e==="chat-with-kb"?{localcontent:B,isLoadingLocal:!1}:e==="tv-copilot"?{localcontent:M,isLoadingLocal:!1}:e==="ai-data-analyzer"?{localcontent:R,isLoadingLocal:!1}:e==="aoai-workbench"?{localcontent:D,isLoadingLocal:!1}:e==="create-custom-gpt"?{localcontent:F,isLoadingLocal:!1}:e==="orchestrate-custom-gpts"?{localcontent:z,isLoadingLocal:!1}:{localcontent:null,isLoadingLocal:!1}}function N(){const e=T(),{section:c}=e,i=x(),p=b(),h=i.palette.mode==="light",o=c||"",s=["about-author","deploy-on-azure"].includes(o),{webContent:u,isLoadingWeb:g}=C(o),{localcontent:m,isLoadingLocal:v}=_(o),a=s?u:m,n=s?g:v,f=t.jsx(P,{filled:!0,title:"No Data",sx:{py:12,my:6,mx:-3}});let r="lg",l="xl";return["introduction","about-author"].includes(o)&&(r="md",l="lg"),t.jsxs(t.Fragment,{children:[t.jsx(w,{children:t.jsx("title",{children:" GBB/AI: Documentation"})}),t.jsxs(k,{maxWidth:p.themeStretch?l:r,sx:{mt:1,mb:1},children:[n&&t.jsxs(t.Fragment,{children:[t.jsx(d,{height:260,variant:"rectangular",sx:{borderRadius:2,my:4}}),t.jsx(A,{spacing:3,sx:{p:0,my:1},children:[...Array(8)].map((K,y)=>t.jsx(d,{variant:"rectangular",sx:{height:28,borderRadius:.75}},y))})]}),!n&&!!a&&t.jsx(I,{sx:{p:{mb:20},hr:{marginY:3.5,borderStyle:"dashed"},h3:{my:2},h4:{my:2},"& .component-image":{borderRadius:0},"& ul, & ol":{my:3},"& pre, pre > code":{fontSize:13},"& pre":{fontSize:12,lineHeight:1.5,position:"relative",left:"6%",width:"88%",color:i.palette.common.white,backgroundColor:i.palette.grey[800]}},children:a}),!n&&!a&&f]})]})}export{N as default};
