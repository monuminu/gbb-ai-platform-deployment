export const createAKb = `
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
`;

export const chatWithKb = `
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
`;
