test = "One day there was sb!"

def iterator():
    for char in test: 
        if char == "H":
            return "I'm Mad"
        else:
            return "wait!"

print(iterator())