def update_init_py(file_name, function_name):
    # 读取原始 __init__.py 文件的内容
    with open('./aigbb_functions/__init__.py', 'r') as init_file:
        init_content = init_file.readlines()

    # 添加 import 语句到文件开头
    import_statement = f'from .{file_name} import {function_name}\n'
    init_content.insert(0, import_statement)

    # 寻找 __all__ 列表所在的行号
    all_index = -1
    for i, line in enumerate(init_content):
        if "__all__" in line:
            all_index = i
            break

    # 在 __all__ 列表中添加函数名
    if all_index != -1:
        all_line = init_content[all_index]
        all_line = all_line.strip()  # 去除行尾的换行符和空格
        all_names = all_line.split('=')[1].strip(' []\n').split(',')  # 获取 __all__ 列表中的函数名
        all_names.append("'" + f'{function_name}' + "'")  # 添加新函数名到列表
        all_line = '__all__ = [' + ', '.join(all_names) + ']'
        init_content[all_index] = all_line

    # 将更新后的内容写入到 __init__.py 文件
    with open('./aigbb_functions/__init__.py', 'w') as init_file:
        init_file.writelines(init_content)