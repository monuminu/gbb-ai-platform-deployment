from flask import Flask, request, jsonify
import asyncio
from jupyter_client import KernelManager
import os
from build_new_env_and_kernel import get_current_kernel_name,build_kernel,remove_all_gbb_env_kernel_except_default
import logging
from function_export import update_init_py

# read the log level from the environment variable
log_level = os.getenv('LOG_LEVEL', 'DEBUG')

# set the log level
numeric_level = getattr(logging, log_level.upper(), logging.DEBUG)

# configure the logging
logging.basicConfig(level=numeric_level)


# app for function call
app = Flask(__name__)

def execute_code_in_kernel(code):
    
    # configure the kernel manager
    os.environ["JUPYTER_PATH"] = os.getcwd()+"/share/jupyter"
    km = KernelManager(kernel_name=get_current_kernel_name())
    km.start_kernel()

    try:
        kc = km.client()
        kc.start_channels()
        kc.wait_for_ready()
        kc.execute("from aigbb_functions import * \n")
        # send the code to the kernel
        msg_id = kc.execute(code)

        # collect the result
        output = []
        error = ""
        result = ""
        while True:
            msg = kc.get_iopub_msg()
            if msg['parent_header'].get('msg_id') == msg_id:
                if msg['msg_type'] == 'execute_result':
                    result = msg['content']['data']['text/plain']
                    break
                elif msg['msg_type'] == 'error':
                    error = '\n'.join(msg['content']['traceback'])
                    break
                elif msg['msg_type'] == 'stream':
                    output.append(msg['content']['text'])
                elif msg['msg_type'] == 'status':
                    execution_state = msg['content']['execution_state']
                    if execution_state == 'idle':
                        break
        
        return {'output': ''.join(output),'result': result,'error': error}
    finally:
        kc.stop_channels()
        km.shutdown_kernel()

@app.route('/', methods=['GET'])
def helloApp1():
    return 'Hello from app!'
    
@app.route('/execute', methods=['POST'])
def execute():
    data = request.get_json()
    code = data.get('code', '')

    if not code:
        return jsonify({'error': 'No code provided'}), 400

    try:
        result =execute_code_in_kernel(code)
        return result
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/register', methods=['POST'])
def register_function():
    data = request.get_json()
    functionName = data.get('functionName', '')
    assert len(functionName) > 0, 'Function name is required!'

    functionScript = data.get('functionScript', '')
    assert len(functionScript) > 0, 'Function name is required!'

    # get the required packages
    packagesRequired = data.get('packages', '')

    # get the required env variables
    envVariables = data.get('envVariables', '')
    env_vars_str=""
    if len(envVariables) > 0:
        # get all of the env variables
        env_vars_str = "import os\n"
        for key, value in envVariables.items():
            # add the env variables to the string
            env_vars_str += f"os.environ['{key}'] = '{value}'\n"

    # Create a directory to store the function
    directory = './aigbb_functions'
    # Create target Directory if don't exist
    if not os.path.exists(directory):
        os.makedirs(directory)
    with open(os.path.join(directory, f'{functionName}.py'), 'w') as file:
        file.write(env_vars_str + functionScript)

    # Add the required packages to the extra-requirements.txt file
    if len(packagesRequired) >0 :
        with open('extra-requirements.txt', 'a') as file:
            file.write('\n' + packagesRequired)

    # Compile the function to validate the syntax
    try:
        compile(functionScript, functionName, "exec")
    except Exception as e:
        return jsonify({'error': f'Function syntax error: {str(e)}'}), 400

    # Update the __init__.py file
    update_init_py(functionName, functionName)
    
    # Rebuild the kernel
    buildKernelFld = build_kernel(recreateFlg=True)
    
    if buildKernelFld:
        return jsonify({'result': 'Function registered successfully!'})
    else:
        return jsonify({'error': 'Function registration failed! Maybe someone is regetering at the same time.Please try later.'}), 500

if __name__ == '__main__':
    # remove the remaining kernel
    remove_all_gbb_env_kernel_except_default()
    # build the default kernel
    build_kernel()
    
    app.run(host='0.0.0.0', port=8080)