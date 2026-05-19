import os

target = """                <button onclick="toggleCart()" aria-label="Cart"
                    class="w-10 h-10 flex items-center justify-center text-charcoal relative"><svg class="w-6 h-6"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                    </svg><span id="m-top-cart-count" class="icon-badge hidden">0</span></button>"""

target_lf = target.replace('\r\n', '\n')

files_changed = 0
for root, _, files in os.walk('.'):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            content_lf = content.replace('\r\n', '\n')
            if target_lf in content_lf:
                # Replace the target exactly, including a trailing newline if we want, or just the target itself
                new_content = content_lf.replace(target_lf + '\n', '').replace(target_lf, '')
                with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
                    f.write(new_content)
                files_changed += 1

print(f'Successfully updated {files_changed} files.')
