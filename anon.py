# small script to anonymize the page for ICML submission
output = True
with open("index.html", "r") as f_in:
    with open("icml.html", "w") as f_out:
        for line in f_in:
            if "anon-on" in line:
                output = False
            if output:
                f_out.write(line)
            if "anon-off" in line:
                output = True

