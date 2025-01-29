export const createACustomGpt = `
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
`;

export const orchestrateCustomGpts = `
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
`;
