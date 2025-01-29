import time
from jupyter_client import KernelManager

def main():
    # 创建一个新的 kernel manager
    km = KernelManager(kernel_name='python3')
    km.start_kernel()

    # 创建一个客户端来与内核交互
    kc = km.client()
    kc.start_channels()

    # 确保客户端在执行代码前已连接
    kc.wait_for_ready()

    # 执行代码
    code = '''
# 在这里写你的代码
for i in range(5):
    print(f"Count: {i}")
'''
    msg_id = kc.execute(code)

    print(f"》》当前执行代码的msg_id : {msg_id} \n")
    # 等待结果并检查执行完成
    execution_complete = False
    while not execution_complete:
        try:
            msg = kc.get_iopub_msg(timeout=1)
            content = msg["content"]

            # 只处理与当前执行相关的消息
            if msg['parent_header'].get('msg_id') == msg_id:

                print(f"》》》当前获取的msg_id : {msg['parent_header'].get('msg_id')} \n")
                print(f"》》》msg_id : {msg_id} \n")

                print(f"》》》》 当前获取的msg : {msg} \n")

                # 查找流输出（stdout）并打印
                if msg["msg_type"] == "stream" and content["name"] == "stdout":
                    print("》》》当前内核的输出：" + content["text"] + " \n")
                    print(content["text"])

                # 检查内核状态是否指示执行已完成
                if msg["msg_type"] == "status" and content["execution_state"] == "idle":
                    print("》》》当前内核的状态和执行状态：" + content["text"] + "\n")
                    execution_complete = True

        except KeyboardInterrupt:
            print("用户中断。")
            break
        except:
            # 如果没有可用消息，我们将到达这里，但我们可以继续并再次尝试。
            pass

    # 清理
    kc.stop_channels()
    km.shutdown_kernel()

if __name__ == '__main__':
    main()