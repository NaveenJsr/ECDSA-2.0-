import random
import hashlib

def add_points(P, Q, p):
    x1, y1 = P
    x2, y2 = Q

    if x1 == x2 and y1 == y2 :
        beta = (3 * x1 * x2 + a) * pow(2*y1, -1, p)
    
    else:
        beta = (y2-y1) * pow(x2 - x1, -1, p)

    x3 = (beta * beta - x1 - x2) % p
    y3 = (beta * (x1 - x3) - y1) % p

    is_on_curve((x3, y3), p)

    return x3, y3

def is_on_curve(P, p):
    x, y = P
    assert (y*y) % p == (pow(x,3,p) + a*x + b) % p


def apply_double_and_add_method(G, k, p):
    target_point = G
    k_binary = bin(k)[2:]

    for i in range(1, len(k_binary)):
        current_bit = k_binary[i: i+1]

        target_point = add_points(target_point, target_point, p)

        if current_bit == "1":
            target_point = add_points(target_point, G, p)
    
    is_on_curve(target_point, p)
    
    return target_point;

#base points
a = 0; b= 7
G = (55066263022277343669578718895168534326250603453777594175500187360389116729240, 32670510020758816978083085130507043184471273380659243275938904335757337482424)

#finite fields
p = pow(2, 256) - pow(2, 32) - pow(2, 9) - pow(2, 8) - pow(2, 7) - pow(2, 6) - pow(2, 4) - pow(2, 0)
n = 115792089237316195423570985008687907852837564279074904382605163141518161494337

isoncurve = is_on_curve(G, p)

# temp_point = G
# for i in range(2, 21):
#     temp_point = add_points(temp_point, G, p)
#     print(f"{i}G = {temp_point}")


# print(apply_double_and_add_method(G = G, k = 20, p = p))

# Alice generate private and public key pair
d = random.getrandbits(256) #private key Alice
Q = apply_double_and_add_method(G = G, k = d, p = p) # public key Alice

random_key = random.getrandbits(256);
random_point = apply_double_and_add_method(G=G, k=random_key, p=p)

message = b"ECDSA"
hash_hex = hashlib.sha1(message).hexdigest()
hash_int = int(hash_hex, 16)


#Sign message 
# (r, s)

r = (random_point[0]) % n
s = ((hash_int + r * d) * pow(random_key, -1, n)) % n

print(r)
print("and")
print(s)

# Verification
w = pow(s, -1, n)
u1 = apply_double_and_add_method(G = G, k = (hash_int * w) % n, p = p)
u2 = apply_double_and_add_method(G = Q, k = (r * w) % n, p = p)

#u1 + u2
checkpoint = add_points(P = u1, Q = u2, p = p)

print(checkpoint)

assert checkpoint[0] == r