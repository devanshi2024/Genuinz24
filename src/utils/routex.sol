// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Provenance {
    enum Role {Admin, User}

    struct Product {
        uint256 productId;
        string name;
        string description;
        string imageURL;
        string[] locationStatuses;
        uint256[] timestamp;
        string[] locationURL;
    }

    mapping(uint256 => Product) public products;
    mapping(address => User) public users;
    mapping(uint256 => uint256) public productIds;
    uint256 public productCount;

    struct User {
        string name;
        string email;
        Role role;
    }

    function addProduct(uint256 _id, string memory _name, string memory _description, string memory _location, string memory _imageURL, string memory _locationURL) public {
        products[_id] = Product(_id, _name, _description, _imageURL, new string[](0), new uint256[](0), new string[](0));
        productIds[productCount] = _id;
        productCount++;
        addLocationStatus(_id, _location, _locationURL);
    }

    function getProduct(uint256 _id) public view returns(Product memory) {
        return products[_id];
    }

    function getAllProducts() public view returns(Product[] memory) {
        Product[] memory allProducts = new Product[](productCount);
        for (uint256 i = 0; i < productCount; i++) {
            allProducts[i] = products[productIds[i]];
        }
        return allProducts;
    }

    function getProductCount() public view returns(uint256) {
        return productCount;
    }

    function addLocationStatus(uint256 _id, string memory _locationStatus, string memory _locationURL) public {
        Product storage product = products[_id];
        product.locationStatuses.push(_locationStatus);
        product.timestamp.push(block.timestamp);
        product.locationURL.push(_locationURL);
    }

    function addUser(string memory _name, string memory _email, Role _role) public {
        users[msg.sender] = User(_name, _email, _role);
    }
}
