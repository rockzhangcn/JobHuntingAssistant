#!/usr/bin/env python3
# npm install -g javascript-obfuscator
import os
import subprocess
import shutil
import zipfile

# 当前目录
root_dir = os.getcwd()

# -------- 1️⃣ 混淆 JS 文件 --------
for dirpath, dirnames, filenames in os.walk(root_dir):
    for filename in filenames:
        if filename.endswith(".js") and not filename.endswith("1.js"):
            filepath = os.path.join(dirpath, filename)
            temp_file = os.path.join(dirpath, filename[:-3] + "1.js")
            print(f"Obfuscating {filepath} → {temp_file}")

            # 调用 javascript-obfuscator
            cmd = [
                "npx",
                "javascript-obfuscator",
                filepath,
                "--output",
                temp_file,
                "--compact",
                "true",
                "--string-array",
                "true"
            ]
            try:
                subprocess.run(cmd, check=True)
                # 覆盖原文件
                shutil.move(temp_file, filepath)
                print(f"✔ Done: {filepath}")
            except subprocess.CalledProcessError as e:
                print(f"✖ Failed: {filepath}")
                print(e)

# -------- 2️⃣ 压缩当前目录成 zip (排除 .git) --------
folder_name = os.path.basename(root_dir)  # 获取当前文件夹名字
zip_filename = os.path.join(root_dir, f"{folder_name}.zip")

EXCLUDE_DIRS = {'.git', 'node_modules', '__pycache__', '.vscode'}
INCLUDE_EXTS = {'.js', '.json', '.html', '.css', '.png', '.jpg', '.jpeg', '.svg'}

with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # 排除不需要的目录
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]

        for filename in filenames:
            ext = os.path.splitext(filename)[1].lower()
            if ext not in INCLUDE_EXTS:
                continue  # 跳过不需要的文件类型

            file_path = os.path.join(dirpath, filename)
            arcname = os.path.relpath(file_path, root_dir)
            zipf.write(file_path, arcname)

print(f"✅ Project zipped into: {zip_filename}")

