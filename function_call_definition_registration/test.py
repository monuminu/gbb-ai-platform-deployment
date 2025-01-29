import time
from jupyter_client import KernelManager

def main():
    # Create a new kernel manager
    km = KernelManager(kernel_name='python3')
    km.start_kernel()

    # Create a client to interact with the kernel
    kc = km.client()
    kc.start_channels()

    # Ensure the client is connected before executing code
    kc.wait_for_ready()

    # Execute the code
    code = 'print("Hello, World!")'
    msg_id = kc.execute(code)

    print(f"》》》》》msg_id : {msg_id}")

    # Wait for the result and display it
    while True:
        try:
            msg = kc.get_iopub_msg(timeout=1)
            
            print(f"<<<<<<msg : {msg}")


            content = msg["content"]

            print(f"<<<<<<content : {msg['content']}")

            
            print(f">>>>> msg_type : {msg['msg_type']}")
            print(f">>>>> name : {content['name']}")

            # When a message with the text stream comes and it's the result of our execution
            if msg["msg_type"] == "stream" and content["name"] == "stdout":
                print("^^^^^^^^" + content["text"])
                break
        except KeyboardInterrupt:
            print("Interrupted by user.")
            break
        except:
            # If no messages are available, we'll end up here, but we can just continue and try again.
            pass

    # Cleanup
    kc.stop_channels()
    km.shutdown_kernel()

if __name__ == '__main__':
    main()