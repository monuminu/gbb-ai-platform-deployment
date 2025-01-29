from build_new_env_and_kernel import build_kernel,remove_all_gbb_env_kernel_except_default

def on_starting(server):
    print("This function runs only once when Gunicorn starts.")
    # remove the remaining kernel
    remove_all_gbb_env_kernel_except_default()
    # build the default kernel
    build_kernel()
    # 你的初始化代码

bind = "0.0.0.0:8080"
loglevel = 'debug'
workers = 4