export const aoaiWorkbench = `
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
`;

export const tvCopilot = `
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
`;

export const chatDa = `
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

`;
